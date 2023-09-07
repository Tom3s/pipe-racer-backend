import { Types } from "mongoose";
import { IUser } from "./User";

export interface ISessionData {
	username: string;
	userId: Types.ObjectId;
	admin: boolean;
	loginDate: Date;
};

export class SessionData implements ISessionData {
	constructor(
		public username: string,
		public userId: Types.ObjectId,
		public admin: boolean,
		public loginDate: Date = new Date()
	) {}
};

export interface IClientSessionData {
	username: string;
	userId: string;
	loginDate: string;
	profilePictureUrl: string;
	sessionToken: string;
}

export class ClientSessionData implements IClientSessionData {	
	public username: string;
	public userId: string;
	public profilePictureUrl: string;

	constructor(
		user: IUser,
		public loginDate: string,
		public sessionToken: string
	) {
		this.username = user.username;
		this.userId = user._id.toHexString();
		this.profilePictureUrl = process.env.HOST + ":" + process.env.PORT + "/api/users/" + this.userId + "/profilePicture"; 
	}
}