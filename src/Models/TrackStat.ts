import mongoose, { Document, Types } from "mongoose";
import { User } from "./User";
import { Track } from "./Track";

const { Schema } = mongoose;

export interface ITrackStat extends Document {
	user: Types.ObjectId;
	track: Types.ObjectId;
	playtime: number;
	nrAttempts: number;
	nrFinishes: number;
	bestLap: number;
	bestTime: number;
}

export const TrackStatSchema = new Schema({
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
	track: {
		type: Schema.Types.ObjectId,
		ref: "Track",
		required: true,
		validate: {
			validator: (trackId: Types.ObjectId) => {
				return Track.exists({ _id: trackId });
			},
		}
	},
	playtime: { type: Number, required: true, default: 0 },
	nrAttempts: { type: Number, required: true, default: 0 },
	nrFinishes: { type: Number, required: true, default: 0 },
	bestLap: { type: Number, required: true, default: 365 * 24 * 60 * 60 * 1000 },
	bestTime: { type: Number, required: true, default: 365 * 24 * 60 * 60 * 1000 },
});

export const TrackStat = mongoose.model<ITrackStat>("TrackStat", TrackStatSchema);
