import { StatusCodes } from "http-status-codes";
import { ResponseError } from "../Models/ResponseError";

export class PassworTooWeakError extends ResponseError {
	statusCode = StatusCodes.UNPROCESSABLE_ENTITY;
	constructor() {
		super("Password must be at least 8 characters long and contain at least one uppercase, one lowercase, and one special character/number.");
	}
}
	