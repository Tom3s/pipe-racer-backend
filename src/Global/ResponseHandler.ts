import { Response } from "express";
import { StatusCodes } from "http-status-codes";


export const sendOKResponse = (response: Response, data: any) => {
	response.status(StatusCodes.OK).send(data);
};

export const sendErrorResponse = (response: Response, error: any) => {
	if (!error.statusCode) 
		error.statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
	response.status(error.statusCode).send(error.message);
};