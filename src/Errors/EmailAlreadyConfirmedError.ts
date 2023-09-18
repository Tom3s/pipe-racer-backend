import { StatusCodes } from "http-status-codes";
import { ResponseError } from "../Models/ResponseError";

export class EmailAlreadyConfirmedError extends ResponseError {
	statusCode = StatusCodes.CONFLICT;
	constructor() {
		super("Email is already confirmed.");
	}
}
	