import mongoose, { Document, Types } from "mongoose";
import { User } from "./User";
import { translations } from "../Translations";
import { Track } from "./Track";

const { Schema } = mongoose;

export interface IRating extends Document {
	userId?: Types.ObjectId;
	trackId?: Types.ObjectId;
	rating: number;
}

export const RatingSchema = new Schema({
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
			}
		}
	},
	rating: { type: Number, required: true, min: 0, max: 5 }
});

export const Rating = mongoose.model<IRating>("Rating", RatingSchema);
