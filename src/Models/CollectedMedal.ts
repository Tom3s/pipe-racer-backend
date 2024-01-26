import mongoose, { Document, Types } from "mongoose";
import { User } from "./User";
import { Track } from "./Track";

const { Schema } = mongoose;

export interface ICollectedMedal extends Document {
	userId: Types.ObjectId;
	trackId: Types.ObjectId;
	
	chronoMedal: boolean;
	totalGoldMedal: boolean;
	totalSilverMedal: boolean;
	totalBronzeMedal: boolean;
	
	blitzMedal: boolean;
	lapGoldMedal: boolean;
	lapSilverMedal: boolean;
	lapBronzeMedal: boolean;
}

export const CollectedMedalSchema = new Schema({
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
	chronoMedal: { type: Boolean, required: true, default: false },
	totalGoldMedal: { type: Boolean, required: true, default: false },
	totalSilverMedal: { type: Boolean, required: true, default: false },
	totalBronzeMedal: { type: Boolean, required: true, default: false },
	blitzMedal: { type: Boolean, required: true, default: false },
	lapGoldMedal: { type: Boolean, required: true, default: false },
	lapSilverMedal: { type: Boolean, required: true, default: false },
	lapBronzeMedal: { type: Boolean, required: true, default: false },
});

export const CollectedMedal = mongoose.model<ICollectedMedal>("CollectedMedal", CollectedMedalSchema);
	
