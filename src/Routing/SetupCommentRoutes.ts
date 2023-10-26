import { Express, Request, Response } from 'express';
import { CommentService } from '../Services/CommentService';
import { createObjectId } from '../Global/CreateObjectId';
import { sendErrorResponse, sendOKResponse } from '../Global/ResponseHandler';
import { AuthenticationService } from '../Services/AuthenticationService';
import { CommentRatingService } from '../Services/CommentRatingService';
import { SessionData } from '../Models/SessionData';

export const setupCommentRoutes = (
	app: Express,
	commentService: CommentService,
	commentRatingService: CommentRatingService
) => {
	const basePath = '/api/comments';

	app.get(`${basePath}/:track`, (request: Request, response: Response) => {
		const trackId = createObjectId(request.params.track as string);

		commentService.getCommentsForTrack(trackId)
			.then((comments) => {
				sendOKResponse(response, comments);
			})
			.catch((error) => {
				sendErrorResponse(response, error);
			});
	});

	app.post(`${basePath}`, async (request: Request, response: Response) => {
		const sessionToken = request.header('Session-Token') as string;

		try {
			const sessionData = await AuthenticationService.verifySessionToken(sessionToken);
			const comment = request.body;
			comment.rating = 0;
			const userId = sessionData.userId;
			const newComment = await commentService.addComment(userId, comment);
			sendOKResponse(response, newComment);
		} catch (error: any) {
			sendErrorResponse(response, error);
		}
	});

	app.put(`${basePath}/:id`, async (request: Request, response: Response) => {
		const sessionToken = request.header('Session-Token') as string;

		try {
			const sessionData = await AuthenticationService.verifySessionToken(sessionToken);
			const commentId = createObjectId(request.params.id as string);
			const comment = { comment: request.body?.comment };
			const userId = sessionData.userId;
			const updatedComment = await commentService.updateComment(userId, commentId, comment);
			sendOKResponse(response, updatedComment);
		} catch (error: any) {
			sendErrorResponse(response, error);
		}
	});

	app.delete(`${basePath}/:id`, async (request: Request, response: Response) => {
		const sessionToken = request.header('Session-Token') as string;

		try {
			const sessionData = await AuthenticationService.verifySessionToken(sessionToken);
			const commentId = createObjectId(request.params.id as string);
			const userId = sessionData.userId;
			await commentService.deleteComment(commentId, userId);
			sendOKResponse(response, {});
		} catch (error: any) {
			sendErrorResponse(response, error);
		}
	});

	app.post(`${basePath}/rate/:id`, async (request: Request, response: Response) => {
		const sessionToken = request.header('Session-Token') as string;
		try {
			const sessionData: SessionData = AuthenticationService.verifySessionToken(sessionToken);
			const commentId = createObjectId(request.params.id as string);
			const userId = createObjectId(sessionData.userId.toHexString());
			const rating = request.body.rating as number;
			const newRating = await commentRatingService.rateComment(commentId, userId, rating);
			sendOKResponse(response, newRating);
		} catch (error: any) {
			sendErrorResponse(response, error);
		}
	});
};