import mongoose, { Document, Types } from "mongoose";
import { User } from "./User";
import { Track } from "./Track";

const { Schema } = mongoose;

export interface ICompletedRun extends Document {
	user: Types.ObjectId;
	track: Types.ObjectId;
	splits: number[][]; // [lapIndex][preLapSplitIndex]
	time?: number;
	bestLap?: number;
	date?: Date;
};

export const CompletedRunSchema = new Schema({
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
	splits: {
		type: [[Number]],
		required: true,
	},
	time: Number,
	bestLap: Number,
});

export const CompletedRun = mongoose.model<ICompletedRun>("CompletedRun", CompletedRunSchema);