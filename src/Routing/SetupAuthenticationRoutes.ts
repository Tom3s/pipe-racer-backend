import { Express, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { AuthenticationService } from '../Services/AuthenticationService';
import { sendErrorResponse, sendOKResponse } from '../Global/ResponseHandler';

export const setupAuthenticationRoutes = (app: Express, authService: AuthenticationService) => {
	const basePath = '/api/auth';

	function sendConfirmEmail(tokenUrl: string, email: string) {
		let emailText = "Please confirm your registration by clicking on the following link: \n" + tokenUrl;
		emailText += "\n\nThis link will expire in 24 hours.";

		const nodemailer = require('nodemailer');

		const transporter = nodemailer.createTransport({
			service: 'gmail',
			auth: {
				user: process.env.EMAIL_ADDRESS,
				pass: process.env.EMAIL_PASSWORD
			}
		});

		const mailOptions = {
			from: process.env.EMAIL_ADDRESS,
			to: email,
			subject: 'Registration confirmation for Pipe Racer',
			text: emailText
		};

		transporter.sendMail(mailOptions, function (error: any, info: any) {
			if (error) {
				throw error;
			} else {
				console.log('Email sent: ' + info.response);
			}
		});
	}

	function sendResetEmail(tokenUrl: string, email: string) {
		let emailText = "You can reset your password by clicking on the following link: \n" + tokenUrl;
		emailText += "\n\nThis link will expire in 10 minutes.";

		const nodemailer = require('nodemailer');

		const transporter = nodemailer.createTransport({
			service: 'gmail',
			auth: {
				user: process.env.EMAIL_ADDRESS,
				pass: process.env.EMAIL_PASSWORD
			}
		});

		const mailOptions = {
			from: process.env.EMAIL_ADDRESS,
			to: email,
			subject: 'Password reset for Pipe Racer',
			text: emailText
		};

		transporter.sendMail(mailOptions, function (error: any, info: any) {
			if (error) {
				throw error;
			} else {
				console.log('Email sent: ' + info.response);
			}
		});
	}

	app.post(`${basePath}/register`, async (request: Request, response: Response) => {
		const username = request.body.username;
		const password = request.body.password;
		const email = request.body.email;
		authService.getRegistrationToken(username, password, email)
			.then((tokenUrl) => {
				sendConfirmEmail(tokenUrl, email);
				sendOKResponse(response, "Check your email for a confirmation link.");
			}
			).catch((error) => {
				sendErrorResponse(response, error);
			});
	});

	app.get(`${basePath}/confirm`, async (request: Request, response: Response) => {
		const token = request.query.token as string;
		try {
			await authService.confirmRegistration(token);
			sendOKResponse(response, "Registration confirmed.");
		} catch (error: any) {
			sendErrorResponse(response, error);
		}
	});

	app.post(`${basePath}/login`, (request: Request, response: Response) => {
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

	app.post(`${basePath}/guest`, (request: Request, response: Response) => {
		const username = request.body.username;
		authService.loginAsGuest(username)
			.then((sessionData) => {
				sendOKResponse(response, sessionData);
			}
			).catch((error) => {
				sendErrorResponse(response, error);
			});
	});

	app.post(`${basePath}/resetPassword`, async (request: Request, response: Response) => {
		const username = request.body.username as string;
		const email = request.body.email as string;
		authService.getResetPasswordToken(username, email)
			.then((tokenUrl) => {
				sendResetEmail(tokenUrl, email);
				sendOKResponse(response, "Check your email for a password reset link.");
			}
			).catch((error) => {
				sendErrorResponse(response, error);
			});
	});

	app.put(`${basePath}/resetPassword`, async (request: Request, response: Response) => {
		const token = request.query.token as string;
		const newPassword = request.body.password;
		authService.resetPassword(token, newPassword)
			.then((user) => {
				sendOKResponse(response, "Password reset.");
			}).catch((error) => {
				sendErrorResponse(response, error);
			});
	});
};
