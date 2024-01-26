import { Types } from "mongoose";
import { CollectedMedalRepository } from "../Repositories/CollectedMedalRepository";
import { TrackRepository } from "../Repositories/TrackRepository";
import { TrackNotFoundError } from "../Errors/TrackNotFoundError";
import { privateDecrypt } from "crypto";
import { ITrack } from "../Models/Track";
import { ICollectedMedal } from "../Models/CollectedMedal";
import { MedalStats } from "../Models/MedalStats";

export class CollectedMedalService {

	private GOLD_MULTIPLIER: number = 1.1;
	private SILVER_MULTIPLIER: number = 1.25;
	private BRONZE_MULTIPLIER: number = 1.5;

	constructor(
		private collectedMedalRepository: CollectedMedalRepository,
		private trackRepository: TrackRepository,
	) {}

	// CREATE - UPDATE

	async collectMedals(
		userId: Types.ObjectId,
		trackId: Types.ObjectId,
		totalTime: number,
		bestLapTime: number,
	) {
		const track = await this.trackRepository.get(trackId);
		if (track === null) {
			throw new TrackNotFoundError();
		}
		return this.collectedMedalRepository.exists(
			{
				userId: userId,
				trackId: trackId,
			}
		)
			.then((foundMedal) => {
				if (foundMedal === null) {
					return this.collectedMedalRepository.save(
						this.getNewMedal(userId, track, totalTime, bestLapTime)
					)
				} else {
					return this.collectedMedalRepository.update(
						foundMedal._id,
						this.getNewMedal(userId, track, totalTime, bestLapTime)
					)
				}
			})
	}

	// READ

	getMedalsForUser(userId: Types.ObjectId): Promise<MedalStats> {
		const medalStats: MedalStats = new MedalStats(userId);
		return this.collectedMedalRepository.getQuery({ userId: userId })
			.then((collectedMedals: ICollectedMedal[]) => {
				collectedMedals.forEach((medal: ICollectedMedal) => {
					medalStats.chronoMedals += medal.chronoMedal ? 1 : 0;
					medalStats.totalGoldMedals += medal.totalGoldMedal ? 1 : 0;
					medalStats.totalSilverMedals += medal.totalSilverMedal ? 1 : 0;
					medalStats.totalBronzeMedals += medal.totalBronzeMedal ? 1 : 0;

					medalStats.blitzMedals += medal.blitzMedal ? 1 : 0;
					medalStats.lapGoldMedals += medal.lapGoldMedal ? 1 : 0;
					medalStats.lapSilverMedals += medal.lapSilverMedal ? 1 : 0;
					medalStats.lapBronzeMedals += medal.lapBronzeMedal ? 1 : 0;
				});

				return medalStats;
			});
	}

	// MISC

	private getNewMedal(
		userId: Types.ObjectId,
		track: ITrack,
		totalTime: number,
		bestLapTime: number,
	): ICollectedMedal {
		const medals = {
			userId: userId,
			trackId: track._id,
			
			chronoMedal: totalTime <= track.bestTotalTime,
			totalGoldMedal: totalTime <= track.bestTotalTime * this.GOLD_MULTIPLIER,
			totalSilverMedal: totalTime <= track.bestTotalTime * this.SILVER_MULTIPLIER,
			totalBronzeMedal: totalTime <= track.bestTotalTime * this.BRONZE_MULTIPLIER,

			blitzMedal: bestLapTime <= track.bestLapTime,
			lapGoldMedal: bestLapTime <= track.bestLapTime * this.GOLD_MULTIPLIER,
			lapSilverMedal: bestLapTime <= track.bestLapTime * this.SILVER_MULTIPLIER,
			lapBronzeMedal: bestLapTime <= track.bestLapTime * this.BRONZE_MULTIPLIER,
		} as ICollectedMedal;
		return medals;
	}
}