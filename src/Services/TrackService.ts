import { Types } from "mongoose";
import { TrackRepository } from "../Repositories/TrackRepository";
import { ITrack } from "../Models/Track";
import { TrackFileService } from "./TrackFileService";
import { TrackNotFoundError } from "../Errors/TrackNotFoundError";
import { TrackDeletionError } from "../Errors/TrackDeletionError";
import { RatingRepository } from "../Repositories/RatingRepository";
import { IRating } from "../Models/Rating";

export class TrackService {
	// private trackRepository: TrackRepository;
	// private trackFileService: TrackFileService;

	// constructor(trackRepository: TrackRepository, trackFileService: TrackFileService) {
	// 	this.trackRepository = trackRepository;
	// 	this.trackFileService = trackFileService;
	// }
	constructor(
		private trackRepository: TrackRepository,
		private ratingRepository: RatingRepository,
		private trackFileService: TrackFileService,
	) {}

	// CREATE

	async uploadTrack(track: any, author: Types.ObjectId, authorName: string): Promise<ITrack> {
		console.log("Metadata: ", track.metadata);
		const newTrack = {
			name: track.metadata.trackName as string,
			author: author,
			bestLapTime: track.metadata.bestLapTime as number,
			bestTotalTime: track.metadata.bestTotalTime as number,
			bestTotalReplay: new Types.ObjectId(track.metadata.bestTotalReplay),
			bestLapReplay: new Types.ObjectId(track.metadata.bestLapReplay),
		} as ITrack;
		track.metadata.author = authorName;
		return this.trackRepository.save(newTrack)
			.then((addedTrack) => {
				return this.trackFileService.saveTrackFile(track, addedTrack._id.toHexString())
					.then(() => {
						return addedTrack;
					})
					.catch((error) => {
						console.log("deleting track entry from database", addedTrack._id);
						this.trackRepository.remove(addedTrack._id);
						throw error;
					})
			})
	}

	incrementDownloadCount(trackId: Types.ObjectId) {
		this.trackRepository.updateQuery(trackId, { $inc: { downloads: 1 } });
	}

	// READ

	async getAllTracks(): Promise<ITrack[]> {
		return this.trackRepository.getPage().then((tracks: ITrack[]) => {
			return tracks.map((track) => {
				return {
					...track.toObject(),
					uploadDate: track._id.getTimestamp()
				}
			}) as ITrack[];
		});
	}

	async getTrackPages(pageSize: number = 0, pageNumber: number = 0, sortByField: string = "_id", sortDirection: number = 1): Promise<ITrack[]> {
		return this.trackRepository.getPage(pageSize, pageNumber, sortByField, sortDirection).then((tracks: ITrack[]) => {
			return tracks.map((track) => {
				return {
					...track.toObject(),
					uploadDate: track._id.getTimestamp()
				}
			}) as ITrack[];
		});
	}

	async getTrack(trackId: Types.ObjectId): Promise<ITrack> {
		return this.trackRepository.get(trackId).then((track) => {
			if (track === null) {
				throw new TrackNotFoundError();
			}
			return {
				...track.toObject(),
				uploadDate: track._id.getTimestamp()
			} as ITrack;
		});
	}

	async getTracksByUser(userId: Types.ObjectId): Promise<ITrack[]> {
		return this.trackRepository.getQuery({ author: userId }).then((tracks) => {
			return tracks.map((track) => {
				return {
					...track.toObject(),
					uploadDate: track._id.getTimestamp()
				}
			}) as ITrack[];
		});
	}

	// UPDATE 

	async setUnlisted(trackId: Types.ObjectId, userId: Types.ObjectId, unlisted: boolean): Promise<ITrack> {
		// return this.trackRepository.update(trackId, { unlisted: unlisted, author: userId }).then((track) => {
		return this.trackRepository.updateWithFindQuery({_id: trackId, author: userId}, { unlisted: unlisted }).then((track) => {
			if (track === null) {
				throw new TrackNotFoundError();
			}
			return track;
		});
	}

	// DELETE

	async deleteTrack(trackId: Types.ObjectId, userId: Types.ObjectId): Promise<ITrack | null> {
		return this.trackRepository.removeByUser(trackId, userId).then((track) => {
			if (track === null) {
				throw new TrackDeletionError();
			}
			this.trackFileService.deleteTrackFile(trackId.toHexString());
			return track;
		});
	}


	// MISC

	async calculateTrackRating(trackId: Types.ObjectId): Promise<IRating> {
		return this.ratingRepository.getQuery({ trackId: trackId }).then((ratings) => {
			let totalRating = 0;
			ratings.forEach((rating) => {
				totalRating += rating.rating;
			});
			const newRating = ratings.length === 0 ? 0 : totalRating / ratings.length;
			this.trackRepository.updateQuery(trackId, { rating: newRating });
			return {
				rating: newRating,
			} as IRating;
		});
	}

}