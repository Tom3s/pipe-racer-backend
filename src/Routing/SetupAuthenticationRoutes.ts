import { Express, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { AuthenticationService } from '../Services/AuthenticationService';

export const setupAuthenticationRoutes = (app: Express, authService: AuthenticationService) => {
	const basePath = '/api/auth';

	app.post(`${basePath}/register`, async (request: Request, response: Response) => {
		const username = request.body.username;
		const password = request.body.password;
		const email = request.body.email;
		authService.getRegistrationToken(username, password, email)
			.then((tokenUrl) => {
				response.status(StatusCodes.OK).send(tokenUrl);
			}
			).catch((error) => {
				response.send(error.message)?.status(error?.statusCode);
			});
	});

	app.get(`${basePath}/confirm`, (request: Request, response: Response) => {
		const token = request.query.token as string;
		// authService.confirmRegistration(token)
		// 	.then(() => {
		// 		response.status(StatusCodes.OK).send("Registration confirmed.");
		// 	}
		// 	).catch((error) => {
		// 		response.send(error.message)?.status(error?.statusCode);
		// 	});
		try {
			authService.confirmRegistration(token);
			response.status(StatusCodes.OK).send("Registration confirmed.");
		} catch (error: any) {
			response.send(error.message)?.status(error?.statusCode);
		}
	});

	app.post(`${basePath}/login`, async (request: Request, response: Response) => {
		const username = request.body.username;
		const password = request.body.password;
		authService.login(username, password)
			.then((sessionData) => {
				response.status(StatusCodes.OK).send(sessionData);
			}
			).catch((error) => {
				response.send(error.message)?.status(error?.statusCode);
			});
	});
};
