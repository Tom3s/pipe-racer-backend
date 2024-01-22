import mongoose, { Document, Types } from "mongoose";
import { Track } from "./Track";
import { User } from "./User";

const { Schema } = mongoose;

export interface IReplay extends Document {
	user: Types.ObjectId;
	track: Types.ObjectId;
	validation: boolean;
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
			validator: function(this: IReplay, trackId: Types.ObjectId): any {
				if (this === undefined) {
					return false;
				}
				// check if exists, and if track exists OR is validation run
				console.log("Track ID: ", trackId, " - Validation: ", this.validation); 
				if (this.validation) {
					return true;
				}
				return Track.exists({ _id: trackId });
			}
		},
		message: "Track does not exist or is not a validation run"
	},
	validation: {
		type: Boolean,
		required: true,
		default: false,
	}
});

export const Replay = mongoose.model<IReplay>("Replay", ReplaySchema);
