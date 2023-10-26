import { CommentRating, ICommentRating } from "../Models/CommentRating";
import { Repository } from "./Repository";

export class CommentRatingRepository extends Repository<ICommentRating> {
	constructor() {
		super(CommentRating);
	}
};