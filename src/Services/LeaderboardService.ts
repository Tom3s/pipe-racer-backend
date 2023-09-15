import { Types } from "mongoose";
import { ICompletedRun } from "../Models/CompletedRun";
import { CompletedRunRepository } from "../Repositories/CompletedRunRepository";

export class LeaderboardService {
	constructor(private completedRunRepository: CompletedRunRepository) { }

	saveRun(run: ICompletedRun): Promise<ICompletedRun> {
		// const laptimes = run.splits.map(lap => lap[lap.length - 1]);
		// const totalTime = laptimes.reduce((a, b) => a + b, 0);
		// const bestLap = Math.min(...laptimes);

		// // Create a new object with the updated properties without modifying the original run
		// run.time = totalTime;
		// run.bestLap = bestLap;

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

	getPlacement(userId: Types.ObjectId, trackId: Types.ObjectId): Promise<ICompletedRun[]> {
		const pipeline = [
			{ $match: { track: trackId } },
			{ $sort: { time: 1 } },
			{
				$group: {
					_id: '$user',
					documents: {
						$push: '$$ROOT',
					},
				},
			},
			{
				$project: {
					placement: {
						$indexOfArray: ['$documents.user', userId],
					},
					user: {
						$arrayElemAt: ['$documents.user', 0],
					},
				},
			},
		];
		return this.completedRunRepository.aggregate(pipeline);
	}
}