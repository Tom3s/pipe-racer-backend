import { IRating, Rating } from "../Models/Rating";
import { Repository } from "./Repository";

export class RatingRepository extends Repository<IRating> {
	constructor() {
		super(Rating);
	}
};