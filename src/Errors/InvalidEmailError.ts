import { ResponseError } from "../Models/ResponseError";
import { StatusCodes } from "http-status-codes";

export class InvalidEmailError extends ResponseError {
	statusCode = StatusCodes.UNPROCESSABLE_ENTITY;
	constructor() {
		super("Invalid email.");
	}
}