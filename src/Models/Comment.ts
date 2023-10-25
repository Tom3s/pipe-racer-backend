import mongoose, { Document, Types } from "mongoose";
import { User } from "./User";
import { Track } from "./Track";

const { Schema } = mongoose;

export interface IComment extends Document {
	track: Types.ObjectId;
	user: Types.ObjectId;
	comment: string;
	rating: number;
	parentComment: Types.ObjectId | null;
};

export const CommentSchema = new Schema({
	user: {
		type: Schema.Types.ObjectId,
		ref: "User",
		required: true,
		validate: {
			validator: (userId: Types.ObjectId) => {
				return User.exists({ _id: userId });
			}
		}
	},
	track: {
		type: Schema.Types.ObjectId,
		ref: "Track",
		required: true,
		validate: {
			validator: (trackId: Types.ObjectId) => {
				return Track.exists({ _id: trackId });
			}
		}
	},
	comment: {
		type: String,
		required: true,
		validate: {
			validator: (comment: string) => {
				return comment.length > 0;
			}
		}
	},
	rating: {
		type: Number,
		required: false,
		default: 0,
	},
	parentComment: {
		type: Schema.Types.ObjectId,
		ref: "Comment",
		required: false,
		default: null,
	},
});

export const Comment = mongoose.model<IComment>("Comment", CommentSchema);
	