import { Types } from "mongoose";
import { IUser } from "./User";
import { verifyTokenExpirationDate } from "../Global/CredentialHandler";

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

	static fromTokenData(tokenData: any): SessionData {
		verifyTokenExpirationDate(tokenData.loginDate);
		return new SessionData(
			tokenData.username,
			new Types.ObjectId(tokenData.userId),
			tokenData.admin,
			new Date(tokenData.loginDate)
		);
	}
};

export interface IClientSessionData {
	username: string;
	userId: string;
	loginDate: string;
	profilePictureUrl: string;
	sessionToken: string;
	guest: boolean;
}

export class ClientSessionData implements IClientSessionData {	
	public username: string;
	public userId: string;
	public profilePictureUrl: string;

	constructor(
		user: IUser,
		public loginDate: string,
		public sessionToken: string,
		public guest: boolean = false
	) {
		this.username = user.username;
		this.userId = user._id.toHexString();
		this.profilePictureUrl = process.env.HOST + ":" + process.env.PORT + "/api/users/picture/" + this.userId; 
	}
}