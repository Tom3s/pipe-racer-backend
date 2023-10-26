import mongoose, { Document, Types } from "mongoose";
import { User } from "./User";
import { Comment } from "./Comment";

const { Schema } = mongoose;

export interface ICommentRating extends Document {
	userId?: Types.ObjectId;
	commentId?: Types.ObjectId;
	rating: number;
}

export const CommentRatingSchema = new Schema({
	userId: {
		type: Schema.Types.ObjectId,
		ref: "User",
		required: true,
		validate: {
			validator: (userId: Types.ObjectId) => {
				return User.exists({ _id: userId });
			},
		}
	},
	commentId: {
		type: Schema.Types.ObjectId,
		ref: "Comment",
		required: true,
		validate: {
			validator: (commentId: Types.ObjectId) => {
				return Comment.exists({ _id: commentId });
			}
		}
	},
	rating: { type: Number, required: true, min: -1, max: 1 }
});

export const CommentRating = mongoose.model<ICommentRating>("CommentRating", CommentRatingSchema);