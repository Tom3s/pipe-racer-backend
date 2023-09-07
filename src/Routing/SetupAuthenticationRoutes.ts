import { Express, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { AuthenticationService } from '../Services/AuthenticationService';
import { sendErrorResponse, sendOKResponse } from '../Global/ResponseHandler';

export const setupAuthenticationRoutes = (app: Express, authService: AuthenticationService) => {
	const basePath = '/api/auth';

	app.post(`${basePath}/register`, async (request: Request, response: Response) => {
		const username = request.body.username;
		const password = request.body.password;
		const email = request.body.email;
		authService.getRegistrationToken(username, password, email)
			.then((tokenUrl) => {
				sendOKResponse(response, tokenUrl);
			}
			).catch((error) => {
				sendErrorResponse(response, error);
			});
	});

	app.get(`${basePath}/confirm`, (request: Request, response: Response) => {
		const token = request.query.token as string;
		try {
			authService.confirmRegistration(token);
			sendOKResponse(response, "Registration confirmed.");
		} catch (error: any) {
			sendErrorResponse(response, error);
		}
	});

	app.post(`${basePath}/login`, async (request: Request, response: Response) => {
		const username = request.body.username;
		const password = request.body.password;
		authService.login(username, password)
			.then((sessionData) => {
				sendOKResponse(response, sessionData);
			}
			).catch((error) => {
				sendErrorResponse(response, error);
			});
	});
};
