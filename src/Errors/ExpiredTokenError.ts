import exp from "constants";
import { ResponseError } from "../Models/ResponseError";
import { StatusCodes } from "http-status-codes";

export class ExpiredTokenError extends ResponseError {
	statusCode = StatusCodes.UNAUTHORIZED;
	constructor() {
		super("Token has expired.");
	}
}

export class InvalidTokenError extends ResponseError {
	statusCode = StatusCodes.UNAUTHORIZED;
	constructor() {
		super("Invalid token.");
	}
}