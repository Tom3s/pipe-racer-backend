import { Types } from "mongoose";
import { ICompletedRun } from "../Models/CompletedRun";
import { CompletedRunRepository } from "../Repositories/CompletedRunRepository";
import { CollectedMedalService } from "./CollectedMedalService";

export class LeaderboardService {
	constructor(
		private completedRunRepository: CompletedRunRepository,
		private collectedMedalService: CollectedMedalService,	
	) { }

	saveRun(run: ICompletedRun): Promise<ICompletedRun> {
		// const laptimes = run.splits.map(lap => lap[lap.length - 1]);
		// const totalTime = laptimes.reduce((a, b) => a + b, 0);
		// const bestLap = Math.min(...laptimes);

		// // Create a new object with the updated properties without modifying the original run
		// run.time = totalTime;
		// run.bestLap = bestLap;

		this.collectedMedalService.collectMedals(
			run.user,
			run.track,
			run.time,
			run.bestLap,
		)

		return this.completedRunRepository.save(run);
	}

	getLeaderboard(trackId: Types.ObjectId): Promise<ICompletedRun[]> {
		const pipeline = [
			{ $match: { track: trackId } },
			{ $sort: { time: 1 } },
			{
				$group: {
					_id: "$user",
					fastestRun: { $first: "$$ROOT" }, // Keep the entire document of the fastest run
				},
			},
			{
				$sort: { "fastestRun.time": 1 }
			},
			{
				$replaceRoot: { newRoot: "$fastestRun" }, // Replace the root document with the fastest run
			},
			{ $lookup: { from: "users", localField: "user", foreignField: "_id", as: "user" } },
			{
				$unwind: "$user" // Unwind the user array produced by the $lookup
			},
			{
				$project: {
					"user.passwordHash": 0,
					"user.email": 0,
					"user.admin": 0,
				}
			}
			// { $limit: 10 },
		];
		return this.completedRunRepository.aggregate(pipeline)
			.then((runs) => {
				return runs.map((run) => {
					return {
						...run,
						date: run._id.getTimestamp(),
					}
				}) as ICompletedRun[];
			});

	}

	getLeaderboardSortedByLap(trackId: Types.ObjectId): Promise<ICompletedRun[]> {
		const pipeline = [
			{ $match: { track: trackId } },
			{ $sort: { bestLap: 1 } },
			{
				$group: {
					_id: "$user",
					fastestRun: { $first: "$$ROOT" }, // Keep the entire document of the fastest run
				},
			},
			{
				$sort: { "fastestRun.bestLap": 1 }
			},
			{
				$replaceRoot: { newRoot: "$fastestRun" }, // Replace the root document with the fastest run
			},
			{ $lookup: { from: "users", localField: "user", foreignField: "_id", as: "user" } },
			{
				$unwind: "$user" // Unwind the user array produced by the $lookup
			},
			{
				$project: {
					"user.passwordHash": 0,
					"user.email": 0,
					"user.admin": 0,
				}
			}
			// { $limit: 10 },
		];
		return this.completedRunRepository.aggregate(pipeline)
			.then((runs) => {
				return runs.map((run) => {
					return {
						...run,
						date: run._id.getTimestamp(),
					}
				}) as ICompletedRun[];
			});
	}

	getPersonalBestTotalTime(trackId: Types.ObjectId, userId: Types.ObjectId): Promise<ICompletedRun> {
		const pipeline = [
			{ $match: { 
				track: trackId, 
				user: userId,
				_id: { $gt: new Types.ObjectId("65b377c93e895d1419ede2db")}
			} },
			{ $sort: { time: 1 } },
			{ $limit: 1 },
		];
		return this.completedRunRepository.aggregate(pipeline)
			.then((runs) => {
				if (runs.length === 0) {
					return {} as ICompletedRun;
				}
				return runs[0];
			});
	}

	getPersonalBestLapTime(trackId: Types.ObjectId, userId: Types.ObjectId): Promise<ICompletedRun> {
		const pipeline = [
			{ $match: { 
				track: trackId, 
				user: userId,
				_id: { $gt: new Types.ObjectId("65b377c93e895d1419ede2db")}
			} },
			{ $sort: { bestLap: 1 } },
			{ $limit: 1 },
		];
		return this.completedRunRepository.aggregate(pipeline)
			.then((runs) => {
				if (runs.length === 0) {
					return {} as ICompletedRun;
				}
				return runs[0];
			});
	}
}