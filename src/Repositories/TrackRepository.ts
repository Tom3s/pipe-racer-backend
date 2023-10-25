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

	getPage(pageSize: number = 0, pageNumber: number = 0, sortByField: string = "_id", sortDirection: number = 1): Promise<ITrack[]> {
		const sortObject: any = {};
		sortObject[sortByField] = sortDirection;
		return this.model.find({})
			.sort(sortObject)
			.skip(pageSize * pageNumber)
			.limit(pageSize)
			.populate({
				path: "author",
				select: "username _id"
		});
	}

	removeByUser(trackId: Types.ObjectId, userId: Types.ObjectId): Promise<ITrack | null> {
		return this.model.findOneAndDelete({ _id: trackId, author: userId }).exec();
	}
};