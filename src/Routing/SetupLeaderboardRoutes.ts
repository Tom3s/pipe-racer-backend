import { Express, Request, Response } from 'express';
import { LeaderboardService } from '../Services/LeaderboardService';
import { createObjectId } from '../Global/CreateObjectId';
import { sendErrorResponse, sendOKResponse } from '../Global/ResponseHandler';
import { SessionData } from '../Models/SessionData';
import { AuthenticationService } from '../Services/AuthenticationService';
import { ICompletedRun } from '../Models/CompletedRun';

export const setupLeaderboardRoutes = (app: Express, leaderboardService: LeaderboardService) => {
	const basePath = "/api/leaderboard";

	app.get(`${basePath}/:trackId`, (request: Request, response: Response) => {
		const trackId = createObjectId(request.params.trackId as string);
		const sortByLap = request.query.sortByLap === 'true';
		if (sortByLap) {
			leaderboardService.getLeaderboardSortedByLap(trackId)
				.then((leaderboard) => {
					sendOKResponse(response, leaderboard);
				})
		} else {
			leaderboardService.getLeaderboard(trackId)
				.then((leaderboard) => {
					sendOKResponse(response, leaderboard);
				})
		}
	});

	app.post(basePath, async (request: Request, response: Response) => {
		const sessionToken = request.header('Session-Token') as string;
		try {
			const sessionData: SessionData = AuthenticationService.verifySessionToken(sessionToken);
			const run = {
				...request.body,
				user: sessionData.userId,
			} as ICompletedRun;
			await leaderboardService.saveRun(run);
			sendOKResponse(response, run);
		} catch (error: any) {
			sendErrorResponse(response, error);
		}
	});
}