import { GlobalScore, IGlobalScore } from "../Models/GlobalScore";
import { Repository } from "./Repository";

export class GlobalScoreRepository extends Repository<IGlobalScore> {
	constructor() {
		super(GlobalScore);
	}
}