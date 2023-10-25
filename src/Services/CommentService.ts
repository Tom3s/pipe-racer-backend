import { Types } from "mongoose";
import { CommentRepository } from "../Repositories/CommentRepository";
import { IComment } from "../Models/Comment";

export class CommentService {
	constructor(
		private commentRepository: CommentRepository
	) { }

	// CREATE

	async addComment(userId: Types.ObjectId,  comment: IComment): Promise<IComment> {
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
}