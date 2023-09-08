import { Express, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { TrackFileService } from '../Services/TrackFileService';
import { SessionData } from '../Models/SessionData';
import { AuthenticationService } from '../Services/AuthenticationService';
import { TrackService } from '../Services/TrackService';
import { sendErrorResponse, sendOKResponse } from '../Global/ResponseHandler';
import { createObjectId } from '../Global/CreateObjectId';
import { TrackNotFoundError } from '../Errors/TrackNotFoundError';

export const setupTrackRoutes = (app: Express, trackService: TrackService, trackFileService: TrackFileService) => {
	const basePath = '/api/tracks';

	app.post(`${basePath}/upload`, (request: Request, response: Response) => {
		const sessionToken = request.header('Session-Token') as string;
		try {
			const sessionData: SessionData = AuthenticationService.verifySessionToken(sessionToken);
			const trackData = request.body;

			// console.log(trackData);

			trackService.uploadTrack(trackData, sessionData.userId)
				.then((track) => {
					console.log("No error")
					sendOKResponse(response, track);
				})
				.catch((error) => {
					console.log("Error status", error?.statusCode);
					sendErrorResponse(response, error);
				});
		} catch (error: any) {
			sendErrorResponse(response, error);
		}
	});

	app.get(`${basePath}`, (request: Request, response: Response) => {
		trackService.getAllTracks()
			.then((tracks) => {
				sendOKResponse(response, tracks);
			})
	});

	app.get(`${basePath}/:id`, (request: Request, response: Response) => {
		const trackId = request.params.id;
		const objectId = createObjectId(trackId);
		trackService.getTrack(objectId)
			.then((track) => {
				if (track === null) {
					sendErrorResponse(response, new TrackNotFoundError());
					return;
				}
				sendOKResponse(response, track);
			})
	});

	app.get(`${basePath}/download/:id`, (request: Request, response: Response) => {
		const sessionToken = request.header('Session-Token') as string;
		try {
			const sessionData: SessionData = AuthenticationService.verifySessionToken(sessionToken);
			const trackId = request.params.id as string;
			trackService.incrementDownloadCount(createObjectId(trackId));
			response.sendFile(trackFileService.getTrackFile(trackId));
		} catch (error: any) {
			sendErrorResponse(response, error);
		}
	});
}