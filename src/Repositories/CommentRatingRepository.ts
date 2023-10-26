import { Types } from "mongoose";
import { CommentRating, ICommentRating } from "../Models/CommentRating";
import { Repository } from "./Repository";

export class CommentRatingRepository extends Repository<ICommentRating> {
	constructor() {
		super(CommentRating);
	}

	removeAllByComment(commentId: Types.ObjectId): Promise<void> {
		return this.model.deleteMany({ commentId: commentId }).exec()
			.then(() => {
				return;
			});
	}
};