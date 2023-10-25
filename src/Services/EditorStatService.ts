import { Types } from "mongoose";
import { IEditorStat } from "../Models/EditorStat";
import { EditorStatRepository } from "../Repositories/EditorStatRepository";

export class EditorStatService {
	constructor(
		private editorStatRepository: EditorStatRepository
	) {}
	
	// CREATE

	addEditorStat(userId: Types.ObjectId, editorStat: IEditorStat): Promise<IEditorStat> {
		const newEditorStat = {
			...editorStat,
			placedAll:
				editorStat.placedTrackPieces +
				editorStat.placedCheckpoints +
				editorStat.placedProps,
			user: userId
		} as IEditorStat;
		return this.editorStatRepository.save(newEditorStat);
	}

	// READ

	getAllEditorStats(): Promise<IEditorStat[]> {
		return this.editorStatRepository.getPage();
	}

	getStatsForUser(userId: Types.ObjectId): Promise<IEditorStat[]> {
		return this.editorStatRepository.getQuery({ user: userId });
	}

	// UPDATE - none
	// DELETE - TODO for admins later
}