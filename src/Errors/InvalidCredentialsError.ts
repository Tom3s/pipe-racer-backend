import { ResponseError } from "../Models/ResponseError";
import { StatusCodes } from "http-status-codes";

export class InvalidCredentialsError extends ResponseError {
	statusCode: number = StatusCodes.UNAUTHORIZED;
	constructor() {
		super("Invalid username or password.");
	}
}

export class InvalidResetCredentialsError extends ResponseError {
	statusCode: number = StatusCodes.UNAUTHORIZED;
	constructor() {
		super("Username does not match email.");
	}
}