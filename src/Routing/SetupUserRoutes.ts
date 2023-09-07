import { sendOKResponse } from "../Global/ResponseHandler";
import { SessionData } from "../Models/SessionData";
import { AuthenticationService } from "../Services/AuthenticationService";
import { ImageFileService } from "../Services/ImageFileService";
import { UserService } from "../Services/UserService";
import { Express, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

export const setupUserRoutes = (app: Express, userService: UserService, imageFileService: ImageFileService) => {
	const basePath = '/api/users';

	const bodyParser = require('body-parser');

	app.post(`${basePath}/uploadPicture`, bodyParser.raw({
		type: 'image/jpeg',
		limit: '10mb'
	}), (request: Request, response: Response) => {
		const sessionToken = request.header('Session-Token') as string;
		const sessionData: SessionData = AuthenticationService.verifySessionToken(sessionToken);

		imageFileService.saveProfilePictureJPG(request.body, sessionData.userId.toHexString());

		sendOKResponse(response, "Profile picture uploaded.");
	});

	app.post(`${basePath}/uploadPicture`, bodyParser.raw({
		type: 'image/png',
		limit: '10mb'
	}), (request: Request, response: Response) => {
		const sessionToken = request.header('Session-Token') as string;
		const sessionData: SessionData = AuthenticationService.verifySessionToken(sessionToken);

		imageFileService.saveProfilePicturePNG(request.body, sessionData.userId.toHexString());

		sendOKResponse(response, "Profile picture uploaded.");
	});

	app.get(`${basePath}/picture/:id`, (request: Request, response: Response) => {
		const userId = request.params.id;
		const profilePicture = imageFileService.getProfilePicture(userId);

		response.status(StatusCodes.OK).sendFile(profilePicture);
	});
}