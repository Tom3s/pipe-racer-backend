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

	// CREATE

	app.post(`${basePath}/upload`, async (request: Request, response: Response) => {
		const sessionToken = request.header('Session-Token') as string;
		try {
			const sessionData: SessionData = AuthenticationService.verifySessionToken(sessionToken);
			const trackData = request.body;

			const track = await trackService.uploadTrack(trackData, sessionData.userId, sessionData.username);
			sendOKResponse(response, track);
		} catch (error: any) {
			sendErrorResponse(response, error);
		}
	});

	// READ

	app.get(`${basePath}`, (request: Request, response: Response) => {
		const pageSize = parseInt(request.query.pageSize as string);
		const pageNumber = parseInt(request.query.pageNumber as string);

		const sortByField = request.query.sortByField as string;
		const ascending = Boolean(request.query.ascending as string);
		const descending = Boolean(request.query.descending as string);

		const sortDirection = ascending ? 1 : descending ? -1 : 1;

		trackService.getTrackPages(pageSize, pageNumber, sortByField, sortDirection)
			.then((tracks) => {
				sendOKResponse(response, tracks);
			})
	});

	app.get(`${basePath}/:id`, (request: Request, response: Response) => {
		const trackId = request.params.id;
		const objectId = createObjectId(trackId);
		trackService.getTrack(objectId)
			.then((track) => {
				sendOKResponse(response, track);
			})
			.catch((error) => {
				sendErrorResponse(response, error);
			});
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

	// UPDATE - not available for tracks

	// DELETE

	app.delete(`${basePath}/:id`, async (request: Request, response: Response) => {
		const sessionToken = request.header('Session-Token') as string;
		try {
			const sessionData: SessionData = AuthenticationService.verifySessionToken(sessionToken);
			const trackId = request.params.id as string;
			await trackService.deleteTrack(createObjectId(trackId), sessionData.userId);
			sendOKResponse(response, "Track deleted.");
		} catch (error: any) {
			sendErrorResponse(response, error);
		}
	});
}