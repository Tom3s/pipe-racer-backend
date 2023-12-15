import { StatusCodes } from "http-status-codes";
import { sendOKResponse, sendErrorResponse } from "../Global/ResponseHandler";
import { SessionData } from "../Models/SessionData";
import { AuthenticationService } from "../Services/AuthenticationService";
import { ImageFileService } from "../Services/ImageFileService";
import { ReplayService } from "../Services/ReplayService";
import { UserService } from "../Services/UserService";
import { Express, Request, Response } from 'express';
import { createObjectId } from "../Global/CreateObjectId";


export const setupReplayRoutes = (app: Express, replayService: ReplayService) => {
	const basePath = '/api/replays';

	const bodyParser = require('body-parser');

	// CREATE
	app.post(`${basePath}`, bodyParser.raw({
		// binary file
		type: 'application/octet-stream',
		limit: '10mb'
	}), async (request: Request, response: Response) => {
		const sessionToken = request.header('Session-Token') as string;
		try {
			const sessionData: SessionData = AuthenticationService.verifySessionToken(sessionToken);

			const replay = await replayService.uploadReplay(request.body, sessionData.userId);
			sendOKResponse(response, replay);
		} catch (error: any) {
			sendErrorResponse(response, error);
		}
	});

	// READ
	app.get(`${basePath}/:id`, async (request: Request, response: Response) => {
		const replayId = createObjectId(request.params.id as string);
		replayService.getReplayFile(replayId)
			.then((replayFile) => {
				response.status(StatusCodes.OK).sendFile(replayFile);
			})
			.catch((error) => {
				sendErrorResponse(response, error);
			});
	});

	app.get(`${basePath}/track/:id`, async (request: Request, response: Response) => {
		const trackId = createObjectId(request.params.id as string);
		replayService.getReplaysByTrackId(trackId)
			.then((replays) => {
				sendOKResponse(response, replays);
			})
			.catch((error) => {
				sendErrorResponse(response, error);
			});
	});

	// UPDATE - not implemented

	// DELETE - not implemented
}