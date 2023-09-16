import { createObjectId } from "../Global/CreateObjectId";
import { sendErrorResponse, sendOKResponse } from "../Global/ResponseHandler";
import { SessionData } from "../Models/SessionData";
import { AuthenticationService } from "../Services/AuthenticationService";
import { RatingService } from "../Services/RatingService";
import { Express, Request, Response } from 'express';

export const setupRatingRoutes = (app: Express, ratingService: RatingService) => {
	const basePath = '/api/ratings';

	// CREATE
	app.post(`${basePath}/:trackId`, async (request: Request, response: Response) => {
		const sessionToken = request.header('Session-Token') as string;
		try {
			const sessionData: SessionData = AuthenticationService.verifySessionToken(sessionToken);
			const trackId = createObjectId(request.params.trackId as string);
			const userId = createObjectId(sessionData.userId.toHexString());
			const rating = request.body.rating as number;
			const newRating = await ratingService.rateTrack(trackId, userId, rating);
			sendOKResponse(response, newRating);
			
		} catch (error: any) {
			sendErrorResponse(response, error);
		}
	});

	// READ
	app.get(`${basePath}`, (request: Request, response: Response) => {
		ratingService.getAllRatings()
			.then((ratings) => {
				sendOKResponse(response, ratings);
			})
	});
}
		