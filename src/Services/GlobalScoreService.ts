import { Types } from "mongoose";
import { calculateGlobalScore } from "../Global/RankCalculator";
import { IGlobalScore } from "../Models/GlobalScore";
import { ITrack } from "../Models/Track";
import { IUser } from "../Models/User";
import { GlobalScoreRepository } from "../Repositories/GlobalScoreRepository";
import { LeaderboardService } from "./LeaderboardService";
import { TrackService } from "./TrackService";
import { UserService } from "./UserService";

export class GlobalScoreService {

	private static lastUpdate: Date = new Date();

	constructor(
		private globalScoreRepository: GlobalScoreRepository,
		private userService: UserService,
		private trackService: TrackService,
		private leaderboardService: LeaderboardService,
	) { }

	async calculateGlobalRanks() {

		if (new Date().getTime() - GlobalScoreService.lastUpdate.getTime() < /* 30 minutes */ 30 * 60 * 1000) {
			return;
		} else {
			GlobalScoreService.lastUpdate = new Date();
		}

		const players = await this.userService.getAllUsers() as IUser[];
		const userScores = players.map((player) => {
			return {
				user: player._id,
				scoreLaps: 0,
				scoreTime: 0,
			} as IGlobalScore;
		});

		const tracks = await this.trackService.getAllTracks() as ITrack[];
		tracks.forEach(async (track: ITrack) => {
			const bestTimes = await this.leaderboardService.getLeaderboard(track._id);
			const bestLaps = await this.leaderboardService.getLeaderboardSortedByLap(track._id);

			bestTimes.forEach((run, index) => {
				const score = userScores.find((score) => score.user === run.user._id);
				if (score)
					score.scoreTime += calculateGlobalScore(index + 1, bestTimes.length);
			});

			bestLaps.forEach((run, index) => {
				const score = userScores.find((score) => score.user === run.user._id);
				if (score)
					score.scoreLaps += calculateGlobalScore(index + 1, bestLaps.length);
			});
		});

		userScores.sort((a, b) => {
			return b.score! - a.score!;
		});

		userScores.forEach((score, index) => {
			score.score = (score.scoreTime + score.scoreLaps) / 2;
			score.globalRank = index + 1;
			this.globalScoreRepository.updateWithFindQuery({ user: score.user }, score);
		});
	}

	async getAllGlobalScores(): Promise<IGlobalScore[]> {
		await this.calculateGlobalRanks();
		return this.globalScoreRepository.getAll();
	}
	
	async getGlobalRanking(userId: Types.ObjectId): Promise<IGlobalScore> {
		await this.calculateGlobalRanks();
		return this.globalScoreRepository.exists({ user: userId })
			.then((exists) => {
				if (exists) {
					return exists;
				} else {
					return {
						user: userId,
						scoreLaps: -1,
						scoreTime: -1,
						score: -1,
						globalRank: -1,
					} as IGlobalScore;
				}
			});
	};
};
