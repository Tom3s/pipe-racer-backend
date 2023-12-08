
import { ResponseError } from "../Models/ResponseError";
import { StatusCodes } from "http-status-codes";

export class AccountNotRegisteredError extends ResponseError {
	statusCode = StatusCodes.UNAUTHORIZED;
	constructor() {
		super("Account not registered or not confirmed (guest)");
	}
}
