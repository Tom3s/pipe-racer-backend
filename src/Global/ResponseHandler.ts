import { Response } from "express";
import { StatusCodes } from "http-status-codes";


export const sendOKResponse = (response: Response, data: any) => {
	response.status(StatusCodes.OK).send(data);
};

export const sendErrorResponse = (response: Response, error: any) => {
	response.send(error.message)?.status(error?.statusCode);
};