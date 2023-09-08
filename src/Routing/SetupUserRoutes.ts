import { createObjectId } from "../Global/CreateObjectId";
import { sendErrorResponse, sendOKResponse } from "../Global/ResponseHandler";
import { SessionData } from "../Models/SessionData";
import { AuthenticationService } from "../Services/AuthenticationService";
import { ImageFileService } from "../Services/ImageFileService";
import { UserService } from "../Services/UserService";
import { Express, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

export const setupUserRoutes = (app: Express, userService: UserService, imageFileService: ImageFileService) => {
	const basePath = '/api/users';

	const bodyParser = require('body-parser');

	app.get(`${basePath}`, (request: Request, response: Response) => {
		userService.getAllUsers()
			.then((users) => {
				sendOKResponse(response, users);
			})
	});

	app.get(`${basePath}/:id`, (request: Request, response: Response) => {
		const userId = createObjectId(request.params.id as string);
		userService.getUserById(userId)
			.then((user) => {
				sendOKResponse(response, user);
			})
			.catch((error) => {
				sendErrorResponse(response, error);
			});
	});

	app.post(`${basePath}/uploadPicture`, bodyParser.raw({
		type: 'image/*',
		limit: '10mb'
	}), (request: Request, response: Response) => {
		const sessionToken = request.header('Session-Token') as string;
		try {
			const sessionData: SessionData = AuthenticationService.verifySessionToken(sessionToken);

			imageFileService.saveProfilePictureJPG(request.body, sessionData.userId.toHexString());

			sendOKResponse(response, "Profile picture uploaded.");
		} catch (error: any) {
			sendErrorResponse(response, error);
		}
	});

	app.get(`${basePath}/picture/:id`, (request: Request, response: Response) => {
		const userId = request.params.id;
		const profilePicture = imageFileService.getProfilePicture(userId);

		response.status(StatusCodes.OK).sendFile(profilePicture);
	});
}