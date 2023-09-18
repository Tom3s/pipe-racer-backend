import { createObjectId } from "../Global/CreateObjectId";
import { sendErrorResponse, sendOKResponse } from "../Global/ResponseHandler";
import { AuthenticationService } from "../Services/AuthenticationService";
import { TrackStatService } from "../Services/TrackStatService";
import { UserStatService } from "../Services/UserStatService";
import { Express, Request, Response } from 'express';

export const setupStatRoutes = (app: Express, trackStatService: TrackStatService, userStatService: UserStatService) => {
	const basePath = "/api/stats";

	app.get(`${basePath}/track`, async (request: Request, response: Response) => {
		trackStatService.getAllTrackStats()
			.then((stats) => {
				sendOKResponse(response, stats);
			})
			.catch((error) => {
				sendErrorResponse(response, error);
			});
	});

	app.get(`${basePath}/user/:userId`, async (request: Request, response: Response) => {
		const userId = createObjectId(request.params.userId);

		userStatService.getGlobalStatsForUser(userId)
			.then((stats) => {
				sendOKResponse(response, stats);
			})
			.catch((error) => {
				sendErrorResponse(response, error);
			});
	});

	app.post(`${basePath}`, async (request: Request, response: Response) => {
		const sessionToken = request.header('Session-Token') as string;
		try {
			const sessionData = await AuthenticationService.verifySessionToken(sessionToken);
			const trackStats = request.body;
			const userId = sessionData.userId;
			const stats = await trackStatService.addTrackStat(userId, trackStats);
			sendOKResponse(response, stats);
		} catch (error: any) {
			sendErrorResponse(response, error);
		}
	});

}