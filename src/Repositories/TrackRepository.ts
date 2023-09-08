import { Types } from "mongoose";
import { ITrack, Track } from "../Models/Track";
import { Repository } from "./Repository";

export class TrackRepository extends Repository<ITrack> {
	constructor() {
		super(Track);
	}

	getAll(): Promise<ITrack[]> {
		return this.model.find({}).populate("author");
	}
};