import { Types } from "mongoose";
import { IRating } from "../Models/Rating";
import { RatingRepository } from "../Repositories/RatingRepository";
import { TrackService } from "./TrackService";

export class RatingService {
	constructor(
		private ratingRepo: RatingRepository,
		private trackService: TrackService
	) { }

	// CREATE

	async rateTrack(trackId: Types.ObjectId, userId: Types.ObjectId, rating: number): Promise<IRating> {
		return this.ratingRepo.exists({ trackId: trackId, userId: userId })
			.then((foundRating) => {
				if (foundRating === null) {
					return this.ratingRepo.save({
						trackId: trackId,
						userId: userId,
						rating: rating
					} as IRating)
						.then((rating) => {
							return this.getNewRating(trackId);
						});
				} else {
					return this.ratingRepo.update(foundRating._id, { rating: rating })
						.then((rating) => {
							return this.getNewRating(trackId);
						});
				}
			});
	}


	// READ - embedded in track

	private getNewRating(trackId: Types.ObjectId) {
		return this.trackService.calculateTrackRating(trackId);
	}

	getAllRatings() {
		return this.ratingRepo.getPage();
	}

	getRatingsByUser(userId: Types.ObjectId) {
		return this.ratingRepo.getQuery({ userId: userId });
	}

	// UPDATE - same as rateTrack



	// DELETE - ratings are permanent
}