import mongoose, { Document, Types } from "mongoose";
import { User } from "./User";
import { Track } from "./Track";
import { Replay } from "./Replay";

const { Schema } = mongoose;

export interface ICompletedRun extends Document {
	user: Types.ObjectId;
	track: Types.ObjectId;
	replay: Types.ObjectId;
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
	replay: {
		type: Schema.Types.ObjectId,
		ref: "Replay",
		unqiue: true,
		required: true,
		validate: {
			validator: function(this: ICompletedRun, replayId: Types.ObjectId): any {
				if (this === undefined) {
					return false;
				}
				// check if exists, and if run has same track as replay
				return Replay.exists({ _id: replayId, track: this.track });
			},
			message: "Replay does not exist or does not have the same track as the run"
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