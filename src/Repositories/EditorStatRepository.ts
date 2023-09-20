import { EditorStat, IEditorStat } from "../Models/EditorStat";
import { Repository } from "./Repository";

export class EditorStatRepository extends Repository<IEditorStat> {
	constructor() {
		super(EditorStat);
	}
};