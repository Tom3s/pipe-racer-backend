import { Types } from "mongoose";
import { Comment, IComment } from "../Models/Comment";
import { Repository } from "./Repository";

export class CommentRepository extends Repository<IComment> {
	constructor() {
		super(Comment);
	}

	getAll(trackId: Types.ObjectId): Promise<IComment[]> {
		return this.model.find({ 
			track: trackId,
		}).populate({
			path: "user",
			select: "username _id"
		}).exec();
	}

	updateByUser(userId: Types.ObjectId, commentId: Types.ObjectId, newComment: any): Promise<IComment | null> {
		return this.model.findOneAndUpdate(
			{ _id: commentId, user: userId },
			newComment,
			{ new: true, runValidators: true }
		).exec();
	}

	removeByUser(commentId: Types.ObjectId, userId: Types.ObjectId): Promise<IComment | null> {
		return this.model.findOneAndDelete({ _id: commentId, user: userId }).exec();
	}
}