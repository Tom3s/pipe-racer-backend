import mongoose, { Document } from "mongoose";

const { Schema } = mongoose;

export interface IUser extends Document {
	username: string;
	nickname?: string;
	email?: string;
	passwordHash?: string;
	profilePictureFileName?: string;
	admin: boolean;
	guest: boolean;
}

export const UserSchema = new Schema({
	username: { type: String, required: true, unique: true },
	nickname: String,
	email: String,
	passwordHash: String,
	profilePictureFileName: String,
	admin: { type: Boolean, required: true, default: false },
	guest: { type: Boolean, required: true, default: false },
});

export const User = mongoose.model<IUser>("User", UserSchema);