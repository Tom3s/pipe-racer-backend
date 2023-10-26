import { Types } from "mongoose";
import { CommentRepository } from "../Repositories/CommentRepository";
import { CommentRatingRepository } from "../Repositories/CommentRatingRepository";
import { IComment } from "../Models/Comment";
import { ICommentRating } from "../Models/CommentRating";

export class CommentService {
	constructor(
		private commentRepository: CommentRepository,
		private commentRatingRepository: CommentRatingRepository
	) { }

	// CREATE

	async addComment(userId: Types.ObjectId, comment: IComment): Promise<IComment> {
		const newComment = {
			...comment,
			user: userId
		} as IComment;
		return this.commentRepository.save(newComment);
	}

	// READ

	getCommentsForTrack(trackId: Types.ObjectId): Promise<IComment[]> {
		return this.commentRepository.getAll(trackId);
	}

	// UPDATE - none

	async updateComment(userId: Types.ObjectId, commentId: Types.ObjectId, newComment: any): Promise<IComment | null> {
		return this.commentRepository.updateByUser(userId, commentId, newComment);
	}

	// DELETE

	async deleteComment(commentId: Types.ObjectId, userId: Types.ObjectId): Promise<IComment | null> {
		return this.commentRepository.removeByUser(commentId, userId);
	}

	// MISC 

	async calculateCommentRating(commentId: Types.ObjectId): Promise<ICommentRating> {
		return this.commentRatingRepository.getQuery({ commentId: commentId }).then((ratings) => {
			let totalRating = 0;
			ratings.forEach((rating) => {
				totalRating += rating.rating;
			});
			this.commentRepository.updateQuery(commentId, { rating: totalRating });
			return {
				rating: totalRating,
			} as ICommentRating;
		});
	}
}