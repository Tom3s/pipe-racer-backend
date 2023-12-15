import { ResponseError } from "../Models/ResponseError";
import { StatusCodes } from "http-status-codes";

export class UploadingReplayError extends ResponseError {
	statusCode: number = StatusCodes.BAD_REQUEST;
	constructor(error: any = {"message": ""}) {
		super("Error uploading replay." + error?.message);
	}
}