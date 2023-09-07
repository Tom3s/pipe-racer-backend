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
			.then((token) => {
				response.status(StatusCodes.OK).send(token);
			}
			).catch((error) => {
				response.send(error.message)?.status(error?.statusCode);
			});
	});
};
