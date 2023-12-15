import { Types } from "mongoose";
import { IReplay, Replay } from "../Models/Replay";
import { Repository } from "./Repository";

export class ReplayRepository extends Repository<IReplay> {
	constructor() {
		super(Replay);
	}

	get(replayId: Types.ObjectId): Promise<IReplay | null> {
		return this.model.findById(replayId).populate({
			path: "user",
			select: "username _id"
		});
	}
}