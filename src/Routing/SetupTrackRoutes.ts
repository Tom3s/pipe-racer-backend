import { Express, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { TrackFileService } from '../Services/TrackFileService';
import { SessionData } from '../Models/SessionData';
import { AuthenticationService } from '../Services/AuthenticationService';
import { TrackService } from '../Services/TrackService';
import { sendErrorResponse, sendOKResponse } from '../Global/ResponseHandler';

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

}