import { ICompletedRun, CompletedRun } from "../Models/CompletedRun";
import { Repository } from "./Repository";

export class CompletedRunRepository extends Repository<ICompletedRun> {
	constructor() {
		super(CompletedRun);
	}
};