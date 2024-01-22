import mongoose, { Document, Types } from "mongoose";
import { IUser, User } from "./User";
import { IReplay, Replay } from "./Replay";

const { Schema } = mongoose;

export interface ITrack extends Document {
	name: string;
	// trackFileName: string;
	trackImageFileName?: string;
	author: Types.ObjectId | IUser;
	rating?: number;
	downloads?: number;
	uploadDate?: Date;
	unlisted?: boolean;
	bestTotalTime: number;
	bestLapTime: number;
	bestTotalReplay: Types.ObjectId | IReplay;
	bestLapReplay: Types.ObjectId | IReplay;

}

export const TrackSchema = new Schema({
	name: { type: String, required: true },
	// trackFileName: { type: String, required: true },
	trackImageFileName: String,
	author: { 
		type: Schema.Types.ObjectId, 
		ref: "User", 
		required: true,
		validate: {
			validator: (userId: Types.ObjectId) => {
				return User.exists({ _id: userId });
			},
			message: "Invalid user ID"
		}
	},
	rating: { type: Number, /*required: true,*/ default: 0 },
	downloads: { type: Number, /*required: true,*/ default: 0 },
	unlisted: { type: Boolean, default: false },
	bestTotalTime: { type: Number, required: true },
	bestLapTime: { type: Number, required: true },
	bestTotalReplay: { 
		type: Schema.Types.ObjectId, 
		ref: "Replay", 
		required: true,
		validate: {
			validator: (replayId: Types.ObjectId) => {
				return Replay.exists({ _id: replayId });
			},
			message: "Best total replay must be empty"
		}
	},
	bestLapReplay: { 
		type: Schema.Types.ObjectId, 
		ref: "Replay", 
		required: true,
		validate: {
			validator: (replayId: Types.ObjectId) => {
				return Replay.exists({ _id: replayId });
			},
			message: "Best lap replay must be empty"
		}
	},
});

export const Track = mongoose.model<ITrack>("Track", TrackSchema);
