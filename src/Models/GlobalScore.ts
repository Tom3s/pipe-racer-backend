import mongoose, { Document, Types } from "mongoose";
import { User } from "./User";

const { Schema } = mongoose;

export interface IGlobalScore extends Document {
	user: Types.ObjectId;
	scoreLaps: number;
	scoreTime: number;
	score: number;
	globalRank?: number;
}

export const GlobalScoreSchema = new Schema({
	user: {
		type: Schema.Types.ObjectId,
		ref: "User",
		required: true,
		validate: {
			validator: (userId: Types.ObjectId) => {
				return User.exists({ _id: userId });
			},
		}
	},
	scoreLaps: { type: Number, required: true, default: -1 },
	scoreTime: { type: Number, required: true, default: -1 },
	score: { type: Number, required: true, default: -1},
	globalRank: { type: Number, required: true, default: -1},
});

export const GlobalScore = mongoose.model<IGlobalScore>("GlobalScore", GlobalScoreSchema);
