import { ResponseError } from "../Models/ResponseError";
import { StatusCodes } from "http-status-codes";

export class BadREquestError extends ResponseError {
	statusCode = StatusCodes.BAD_REQUEST;
	constructor(missingFields: string[]) {
		super(`Bad request. Missing fields: ${missingFields.join(", ")}`);
	}
}