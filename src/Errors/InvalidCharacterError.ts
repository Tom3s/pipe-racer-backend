import { StatusCodes } from "http-status-codes";
import { ResponseError } from "../Models/ResponseError";

export class InvalidCharacterError extends ResponseError {
	statusCode = StatusCodes.UNPROCESSABLE_ENTITY;
	constructor() {
		super("Invalid character encountered in input.");
	}
}
	