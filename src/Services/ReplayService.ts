import { Types } from "mongoose";
import { ReplayRepository } from "../Repositories/ReplayRepository";
import { ReplayFileService } from "./ReplayFileService";
import { IReplay } from "../Models/Replay";
import { LeaderboardService } from "./LeaderboardService";

const CURRENT_FORMAT_VERSION = 1;

export class ReplayService {
	constructor(
		private replayRepository: ReplayRepository,
		private replayFileService: ReplayFileService,
		private leaderboardService: LeaderboardService,
	) { }

	// CREATE

	async uploadReplay(replay: Buffer, user: Types.ObjectId): Promise<IReplay> {
		// replay:
		// format (8bit int)
		// [trackId, nrlaps, nrcheckpoint] (line)
		// nrCars (16bit int)
		// time (32bit int)

		const formatVersion = replay.readInt8(0);
		if (formatVersion !== CURRENT_FORMAT_VERSION) {
			throw new Error(`Invalid replay format version: ${formatVersion} (newest: ${CURRENT_FORMAT_VERSION})`);
		}
		const trackMetadata = replay.toString("utf-8", 1, replay.indexOf("\n"));
		const trackId = trackMetadata.split(",")[0];
		const time = replay.readUInt32LE(replay.indexOf("\n") + 3);

		console.log("Time: ", time);

		const newReplay = {
			user: user,
			track: new Types.ObjectId(trackId),
			time: time,
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

	async uploadValidationReplay(replay: Buffer, user: Types.ObjectId): Promise<IReplay> {
		const formatVersion = replay.readInt8(0);
		if (formatVersion !== CURRENT_FORMAT_VERSION) {
			throw new Error(`Invalid replay format version: ${formatVersion} (newest: ${CURRENT_FORMAT_VERSION})`);
		}
		const trackMetadata = replay.toString("utf-8", 1, replay.indexOf("\n"));
		// const trackId = trackMetadata.split(",")[0];
		const time = replay.readUInt32LE(replay.indexOf("\n") + 3);

		console.log("Time: ", time);

		const newReplay = {
			user: user,
			track: new Types.ObjectId("5f9f9b9b9b9b9b9b9b9b9b9b"),
			time: time,
			validation: true,
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