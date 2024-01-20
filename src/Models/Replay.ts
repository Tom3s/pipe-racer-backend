import mongoose, { Document, Types } from "mongoose";
import { Track } from "./Track";
import { User } from "./User";

const { Schema } = mongoose;

export interface IReplay extends Document {
	user: Types.ObjectId;
	track: Types.ObjectId;
	time?: number;
	date?: Date;
};

export const ReplaySchema = new Schema({
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
});

export const Replay = mongoose.model<IReplay>("Replay", ReplaySchema);
