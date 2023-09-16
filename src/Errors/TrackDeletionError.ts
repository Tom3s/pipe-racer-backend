import { ResponseError } from "../Models/ResponseError";
import { StatusCodes } from "http-status-codes";

export class TrackDeletionError extends ResponseError {
	statusCode = StatusCodes.UNAUTHORIZED;
	constructor() {
		super("Track not owned by user or does not exist.");
	}
}