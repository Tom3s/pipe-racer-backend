import { ResponseError } from "../Models/ResponseError";
import { StatusCodes } from "http-status-codes";

export class InvalidReplayError extends ResponseError{
	statusCode: number = StatusCodes.NOT_FOUND;
	constructor(replayId: string = "") {
		super("Replay with ID " + replayId + " does not exists.");
	}
}
