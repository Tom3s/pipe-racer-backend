import { Types } from "mongoose";
import { ITrackStat } from "../Models/TrackStat";
import { TrackStatRepository } from "../Repositories/TrackStatRepository";

export class TrackStatService {
	constructor(
		private trackStatRepository: TrackStatRepository
	) {}
	
	// CREATE

	addTrackStat(userId: Types.ObjectId, trackStat: ITrackStat): Promise<ITrackStat> {
		const newTrackStat = {
			...trackStat,
			user: userId
		} as ITrackStat;
		return this.trackStatRepository.save(newTrackStat);
	}

	// READ

	getAllTrackStats(): Promise<ITrackStat[]> {
		return this.trackStatRepository.getPage();
	}

	getStatsForUser(userId: Types.ObjectId): Promise<ITrackStat[]> {
		return this.trackStatRepository.getQuery({ user: userId });
	}

	// UPDATE - none
	// DELETE - TODO for admins later
}