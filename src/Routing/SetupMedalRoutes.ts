import { Express, Request, Response } from 'express';
import { createObjectId } from '../Global/CreateObjectId';
import { sendErrorResponse, sendOKResponse } from '../Global/ResponseHandler';
import { SessionData } from '../Models/SessionData';
import { CollectedMedalService } from '../Services/CollectedMedalService';

export const setupMedalRoutes = (
	app: Express,
	collectedMedalService: CollectedMedalService,
) => {
	const basePath = '/api/medals';

	app.get(`${basePath}/:userId`, (request: Request, response: Response) => {
		const userId = createObjectId(request.params.userId as string);
		collectedMedalService.getMedalsForUser(userId)
			.then((medals) => {
				sendOKResponse(response, medals);
			})
			.catch((error) => {
				sendErrorResponse(response, error);
			});
	});
};
