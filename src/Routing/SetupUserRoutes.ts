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

	// CREATE - implemented in auth service

	// READ
	app.get(`${basePath}`, (request: Request, response: Response) => {
		const pageSize = parseInt(request.query.pageSize as string);
		const pageNumber = parseInt(request.query.pageNumber as string);

		userService.getUserPage(pageSize, pageNumber)
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

	app.get(`${basePath}/picture/:id`, (request: Request, response: Response) => {
		const userId = request.params.id;
		const profilePicture = imageFileService.getProfilePicture(userId);

		response.status(StatusCodes.OK).sendFile(profilePicture);
	});

	// UPDATE

	app.put(`${basePath}`, async (request: Request, response: Response) => {
		const sessionToken = request.header('Session-Token') as string;
		try {
			const sessionData: SessionData = AuthenticationService.verifySessionToken(sessionToken);

			const updatedUser = await userService.updateUser(sessionData.userId, request.body)
			sendOKResponse(response, updatedUser);
		} catch (error: any) {
			sendErrorResponse(response, error);
		}
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

	// DELETE

	app.delete(`${basePath}`, async (request: Request, response: Response) => {
		const sessionToken = request.header('Session-Token') as string;
		try {
			const sessionData: SessionData = AuthenticationService.verifySessionToken(sessionToken);

			const deletedUser = await userService.deleteUser(sessionData.userId)
			sendOKResponse(response, deletedUser);
		} catch (error: any) {
			sendErrorResponse(response, error);
		}
	});

}