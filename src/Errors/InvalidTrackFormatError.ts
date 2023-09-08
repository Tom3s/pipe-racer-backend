import { ResponseError } from "../Models/ResponseError";
import { StatusCodes } from "http-status-codes";

export class InvalidTrackFormatError extends ResponseError{
	statusCode: number = StatusCodes.BAD_REQUEST;
	constructor(missingField: string = "") {
		super("Invalid track file formatting. " + missingField);
	}
}
