import { sendErrorResponse, sendOKResponse } from "../Global/ResponseHandler";
import { GlobalScoreService } from "../Services/GlobalScoreService";
import { Express, Request, Response } from "express";

export const setupGlobalRankRoutes = (app: Express, globalScoreService: GlobalScoreService) => {
	const basePath = "/api/ranks";

	app.get(`${basePath}`, async (request: Request, response: Response) => {
		// const pageSize = parseInt(request.query?.pageSize as string);
		const pageSize = request.query.pageSize ? parseInt(request.query.pageSize as string) : 100;
		const pageNumber = request.query.pageNumber ? parseInt(request.query.pageNumber as string) : 0;

		globalScoreService.getAllGlobalScores(pageSize, pageNumber)
			.then((scores) => {
				sendOKResponse(response, scores);
			})
			.catch((error) => {
				sendErrorResponse(response, error);
			});
	});

}