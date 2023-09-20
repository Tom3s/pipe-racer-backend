import mongoose, { Document, Types } from "mongoose";
import { User } from "./User";

const { Schema } = mongoose;

export interface IEditorStat extends Document {
	user: Types.ObjectId;
	editorTime: number;
	placedTrackPieces: number;
	placedCheckpoints: number;
	placedProps: number;
	placedAll?: number;
}

export const EditorStatSchema = new Schema({
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
	editorTime: { type: Number, required: true, default: 0 },
	placedTrackPieces: { type: Number, required: true, default: 0 },
	placedCheckpoints: { type: Number, required: true, default: 0 },
	placedProps: { type: Number, required: true, default: 0 },
	placedAll: { type: Number, required: true, default: 0 },
});

export const EditorStat = mongoose.model<IEditorStat>("EditorStat", EditorStatSchema);
