import { ResponseError } from "../Models/ResponseError";
import { StatusCodes } from "http-status-codes";

export class ExpiredRegistrationTokenError extends ResponseError {
	statusCode = StatusCodes.UNAUTHORIZED;
	constructor() {
		super("Registration token has expired.");
	}
}