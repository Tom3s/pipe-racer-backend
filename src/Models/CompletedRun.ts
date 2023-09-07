import mongoose, { Document, Types } from "mongoose";
import { User } from "./User";
import { Track } from "./Track";

const { Schema } = mongoose;

export interface ICompletedRun extends Document {
	userId: Types.ObjectId;
	trackId: Types.ObjectId;
	splits: number[][]; // [lapIndex][preLapSplitIndex]
};

export const CompletedRunSchema = new Schema({
	userId: {
		type: Schema.Types.ObjectId,
		ref: "User",
		required: true,
		validate: {
			validator: (userId: Types.ObjectId) => {
				return User.exists({ _id: userId });
			}
		}
	},
	trackId: {
		type: Schema.Types.ObjectId,
		ref: "Track",
		required: true,
		validate: {
			validator: (trackId: Types.ObjectId) => {
				return Track.exists({ _id: trackId });
			}
		}
	},
	splits: {
		type: [[Number]],
		required: true,
	}
});

export const CompletedRun = mongoose.model<ICompletedRun>("CompletedRun", CompletedRunSchema);