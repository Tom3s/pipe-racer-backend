import { Types } from "mongoose";
import { ITrack, Track } from "../Models/Track";
import { Repository } from "./Repository";

export class TrackRepository extends Repository<ITrack> {
	constructor() {
		super(Track);
	}

	get(trackId: Types.ObjectId): Promise<ITrack | null> {
		return this.model.findById(trackId).populate({
			path: "author",
			select: "username _id"
		});
	}

	getAll(): Promise<ITrack[]> {
		return this.model.find({}).populate({
			path: "author",
			select: "username _id"
		});
	}

	removeByUser(trackId: Types.ObjectId, userId: Types.ObjectId): Promise<ITrack | null> {
		return this.model.findOneAndDelete({ _id: trackId, author: userId }).exec();
	}
};