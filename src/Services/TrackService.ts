import { Types } from "mongoose";
import { TrackRepository } from "../Repositories/TrackRepository";
import { ITrack } from "../Models/Track";
import { TrackFileService } from "./TrackFileService";

export class TrackService {
	private trackRepository: TrackRepository;
	private trackFileService: TrackFileService;

	constructor(trackRepository: TrackRepository, trackFileService: TrackFileService) {
		this.trackRepository = trackRepository;
		this.trackFileService = trackFileService;
	}

	async uploadTrack(track: any, author: Types.ObjectId): Promise<ITrack> {
		const newTrack = {
			name: track.trackName as string,
			author: author,
		} as ITrack;
		return this.trackRepository.save(newTrack)
			.then((addedTrack) => {
				return this.trackFileService.saveTrackFile(track, addedTrack._id.toHexString())
					.then(() => {
						return addedTrack;
					})
					.catch((error) => {
						console.log("deleting entry from database", addedTrack._id);
						this.trackRepository.remove(addedTrack._id).then();
						throw error;
					})
			})
	}

	async getAllTracks(): Promise<ITrack[]> {
		return this.trackRepository.getAll().then((tracks: ITrack[]) => {
			return tracks.map((track) => {
				return {
					...track.toObject(),
					uploadDate: track._id.getTimestamp()
				}
			}) as ITrack[];
		});
	}

	async getTrack(trackId: Types.ObjectId): Promise<ITrack | null> {
		return this.trackRepository.get(trackId);
	}
}