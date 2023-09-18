import { Types } from "mongoose";

export interface IUserStats {
		// hours played
		// h ingame
		// h in editor
		// tracks uploaded
		// global rank (?)
		// tracks played
	user: Types.ObjectId;
	mostPlayedTrack?: Types.ObjectId;
	totalPlaytime: number;
	ingamePlaytime: number;
	editorPlaytime: number;
	tracksUploaded: number;
	tracksPlayed: number;
	tracksRated: number;
	totalAttempts: number;
	totalFinishes: number;
	
}