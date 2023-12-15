import { Types } from "mongoose";
import { ReplayRepository } from "../Repositories/ReplayRepository";
import { ReplayFileService } from "./ReplayFileService";
import { IReplay } from "../Models/Replay";
import { LeaderboardService } from "./LeaderboardService";

export class ReplayService {
	constructor(
		private replayRepository: ReplayRepository,
		private replayFileService: ReplayFileService,
		private leaderboardService: LeaderboardService,
	) { }

	// CREATE

	async uploadReplay(replay: Buffer, user: Types.ObjectId): Promise<IReplay> {
		const replayAsString = replay.toString('utf8');
		const lines = replayAsString.split("\n");
		const trackId = lines[0];
		const nrCars = parseInt(lines[1]);
		const times = [];
		for (let i = 2; i < 2 + nrCars; i++) {
			times.push(lines[i]);
		}
		const newReplay = {
			user: user,
			track: new Types.ObjectId(trackId),
			time: Math.min(...times.map((time) => parseInt(time))),
		} as IReplay;

		return this.replayRepository.save(newReplay)
			.then((addedReplay) => {
				return this.replayFileService.saveReplayFile(replay, addedReplay._id.toHexString())
					.then(() => {
						return addedReplay;
					})
					.catch((error) => {
						console.log("deleting replay entry from database", addedReplay._id);
						this.replayRepository.remove(addedReplay._id);
						throw error;
					})
			})
	}

	// READ

	async getReplaysByTrackId(trackId: Types.ObjectId): Promise<IReplay[]> {
		const leaderboard = await this.leaderboardService.getLeaderboard(trackId);
		const replays = await Promise.all(leaderboard.map((run) => {
			return this.replayRepository.get(run.replay);
		}));
		const validReplays = replays.filter((replay): replay is IReplay => replay !== null);
		return validReplays;
	}

	async getReplayFile(replayId: Types.ObjectId): Promise<string> {
		return this.replayFileService.getReplayFile(replayId.toHexString());
	}
}