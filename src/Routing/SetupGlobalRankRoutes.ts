import { sendErrorResponse, sendOKResponse } from "../Global/ResponseHandler";
import { GlobalScoreService } from "../Services/GlobalScoreService";
import { Express, Request, Response } from "express";

export const setupGlobalRankRoutes = (app: Express, globalScoreService: GlobalScoreService) => {
	const basePath = "/api/ranks";

	app.get(`${basePath}`, async (request: Request, response: Response) => {
		globalScoreService.getAllGlobalScores()
			.then((scores) => {
				sendOKResponse(response, scores);
			})
			.catch((error) => {
				sendErrorResponse(response, error);
			});
	});

}