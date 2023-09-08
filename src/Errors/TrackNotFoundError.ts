import { ResponseError } from "../Models/ResponseError";
import { StatusCodes } from "http-status-codes";

export class TrackNotFoundError extends ResponseError {
	statusCode = StatusCodes.NOT_FOUND;
	constructor() {
		super("Track not found.");
	}
}