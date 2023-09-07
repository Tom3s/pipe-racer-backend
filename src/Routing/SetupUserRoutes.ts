import { sendOKResponse } from "../Global/ResponseHandler";
import { SessionData } from "../Models/SessionData";
import { AuthenticationService } from "../Services/AuthenticationService";
import { ImageFileService } from "../Services/ImageFileService";
import { UserService } from "../Services/UserService";
import { Express, Request, Response } from 'express';

export const setupUserRoutes = (app: Express, userService: UserService, imageFileService: ImageFileService) => {
	const basePath = '/api/user';

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
}