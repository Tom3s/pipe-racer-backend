import { Types } from "mongoose";
import { ITrack } from "./Track";

export interface IUserStats {
		// hours played
		// h ingame
		// h in editor
		// tracks uploaded
		// global rank (?)
		// tracks played
	user: Types.ObjectId;
	mostPlayedTrack?: ITrack;
	totalPlaytime: number;
	ingamePlaytime: number;
	editorPlaytime: number;
	tracksUploaded: number;
	tracksPlayed: number;
	tracksRated: number;
	totalAttempts: number;
	totalFinishes: number;
	placedTrackPieces: number;
	placedCheckpoints: number;
	placedProps: number;
	placedAll: number;
	nrTests: number;
	
}