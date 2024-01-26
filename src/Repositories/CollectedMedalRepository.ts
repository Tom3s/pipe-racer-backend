import { CollectedMedal, ICollectedMedal } from "../Models/CollectedMedal";
import { Repository } from "./Repository";

export class CollectedMedalRepository extends Repository<ICollectedMedal> {
	constructor() {
		super(CollectedMedal);
	}
}