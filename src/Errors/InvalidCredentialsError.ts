import { ResponseError } from "../Models/ResponseError";
import { StatusCodes } from "http-status-codes";

export class InvalidCredentialsError extends ResponseError {
	statusCode: number = StatusCodes.UNAUTHORIZED;
	constructor() {
		super("Invalid username or password.");
	}
}