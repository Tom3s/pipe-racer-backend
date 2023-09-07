import { StatusCodes } from "http-status-codes";
import { ResponseError } from "../Models/ResponseError";

export class UsernameTakenError extends ResponseError {
	statusCode = StatusCodes.CONFLICT;
	constructor() {
		super("Username is already taken.");
	}
}
	