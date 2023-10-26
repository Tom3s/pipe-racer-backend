import { Types } from "mongoose";
import { ICommentRating } from "../Models/CommentRating";
import { CommentService } from "./CommentService";
import { CommentRatingRepository } from "../Repositories/CommentRatingRepository";

export class CommentRatingService {
	constructor(
		private commentRatingRepo: CommentRatingRepository,
		private commentService: CommentService
	) { }

	async rateComment(commentId: Types.ObjectId, userId: Types.ObjectId, rating: number): Promise<ICommentRating> {
		rating = rating >= 0 ? 1 : -1;
		return this.commentRatingRepo.exists({ commentId: commentId, userId: userId })
			.then((foundRating) => {
				if (foundRating === null) {
					return this.commentRatingRepo.save({
						commentId: commentId,
						userId: userId,
						rating: rating
					} as ICommentRating)
						.then((rating) => {
							return this.getNewRating(commentId);
						});
				} else {
					return this.commentRatingRepo.update(foundRating._id, { rating: rating })
						.then((rating) => {
							return this.getNewRating(commentId);
						});
				}
			});
	}


	private getNewRating(trackId: Types.ObjectId) {
		return this.commentService.calculateCommentRating(trackId);
	}
}
