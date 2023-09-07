import { StatusCodes } from "http-status-codes";
import { ResponseError } from "../Models/ResponseError";

export class PassworTooWeakError extends ResponseError {
	statusCode = StatusCodes.UNPROCESSABLE_ENTITY;
	constructor() {
		super("Password is too weak.");
	}
}
	