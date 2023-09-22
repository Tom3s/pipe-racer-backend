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

	private static lastUpdate: Date = new Date(0);

	constructor(
		private globalScoreRepository: GlobalScoreRepository,
		private userService: UserService,
		private trackService: TrackService,
		private leaderboardService: LeaderboardService,
	) { }

	async calculateGlobalRanks() {
		if (new Date().getTime() - GlobalScoreService.lastUpdate.getTime() < 30 * 60 * 1000) {
			return;
		} else {
			console.log("Calculating global ranks");
			GlobalScoreService.lastUpdate = new Date();
		}
	
		const players = await this.userService.getAllUsers() as IUser[];
		// console.log("Calculating global ranks for " + players.length + " players");
		const userScores = players.map((player) => {
			return {
				user: player._id,
				scoreLaps: 0,
				scoreTime: 0,
			} as IGlobalScore;
		});
	
		const tracks = await this.trackService.getAllTracks() as ITrack[];
		// console.log("Calculating global ranks for " + tracks.length + " tracks");
	
		for (const track of tracks) {
			const bestTimes = await this.leaderboardService.getLeaderboard(track._id);
			const bestLaps = await this.leaderboardService.getLeaderboardSortedByLap(track._id);
	
			// console.log("Calculating global ranks for " + bestTimes.length + " runs");
			// console.log("Calculating global ranks for " + bestLaps.length + " runs");
	
			bestTimes.forEach((run, index) => {
				const scoreIndex = userScores.findIndex((score) => score.user.toHexString() === run.user._id.toHexString());
				if (scoreIndex !== -1) {
					userScores[scoreIndex].scoreTime += calculateGlobalScore(index + 1, bestTimes.length);
					// console.log("Adding " + calculateGlobalScore(index + 1, bestTimes.length) + " to " + run.user);
				}
			});
	
			bestLaps.forEach((run, index) => {
				const scoreIndex = userScores.findIndex((score) => score.user.toHexString() === run.user._id.toHexString());
				if (scoreIndex !== -1) {
					userScores[scoreIndex].scoreLaps += calculateGlobalScore(index + 1, bestLaps.length);
					// console.log("Adding " + calculateGlobalScore(index + 1, bestLaps.length) + " to " + run.user);
				}
			});
		}
	
		// console.log("Scores calculated", userScores);
	
		const sortedScores = userScores.sort((a: IGlobalScore, b: IGlobalScore) => {
			// return b.score - a.score;
			return (b.scoreTime + b.scoreLaps) - (a.scoreTime + a.scoreLaps);	
		});
	
		for (const score of sortedScores) {
			score.score = Math.floor((score.scoreTime + score.scoreLaps) / 2);
			score.globalRank = userScores.indexOf(score) + 1;
	
			// Check if the user score exists and update or save accordingly
			if (await this.globalScoreRepository.exists({ user: score.user })) {
				await this.globalScoreRepository.updateWithFindQuery({ user: score.user }, score);
			} else {
				await this.globalScoreRepository.save(score);
			}
		}
	}
	

	async getAllGlobalScores(): Promise<IGlobalScore[]> {
		await this.calculateGlobalRanks();
		// sort by .score
		const pipeline = [
			{ $sort: { globalRank: 1 } },
			{ $lookup: { from: "users", localField: "user", foreignField: "_id", as: "user" } },
			{ $unwind: "$user" },
			{ $project: { "user.passwordHash": 0, "user.email": 0, "user.sessionToken": 0, "user.admin": 0 } },
		];
		return this.globalScoreRepository.aggregate(pipeline);
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
