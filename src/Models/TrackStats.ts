import mongoose, { Document, Types } from "mongoose";
import { User } from "./User";
import { Track } from "./Track";

const { Schema } = mongoose;

export interface ITrackStats extends Document {
	userId: Types.ObjectId;
	trackId: Types.ObjectId;
	playtime: number;
	nrAttempts: number;
	nrFinishes: number;
	bestLap: number;
	bestTime: number;
}

export const TrackStatsSchema = new Schema({
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
	trackId: {
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
	bestLap: { type: Number, required: true, default: 0 },
	bestTime: { type: Number, required: true, default: 0 },
});
