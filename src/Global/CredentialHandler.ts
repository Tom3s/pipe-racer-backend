import { ExpiredRegistrationTokenError } from "../Errors/ExpiredRegistrationTokenError";
import { ExpiredTokenError } from "../Errors/ExpiredTokenError";
import { InvalidEmailError } from "../Errors/InvalidEmailError";
import { PassworTooWeakError } from "../Errors/PasswordTooWeakError";

export const verifyPasswordStrength = (password: string) => {
	const regex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[\d@$!%*#?&._\-,])[A-Za-z\d@$!%*#?&._\-,]{8,}$/;
	if (!regex.test(password)) {
		throw new PassworTooWeakError();
	}
};

export const verifyEmailValidity = (email: string) => {
	const regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
	if (!regex.test(email)) {
		throw new InvalidEmailError();
	}
};

export const generatePasswordHash = (password: string): string => {
	const { createHash } = require('crypto');

	return createHash('sha256').update(password).digest('hex');
};

export const verifyTokenExpirationDate = (date: Date) => {
	date = new Date(date);
	const now = new Date();
	const diff = now.getTime() - date.getTime();
	const diffInHours = diff / (1000 * 3600);
	if (diffInHours > 24) {
		throw new ExpiredRegistrationTokenError();
	}
};

export const verifyResetTokenExpirationDate = (date: Date) => {
	date = new Date(date);
	const now = new Date();
	const diff = now.getTime() - date.getTime();
	const diffInMinutes = diff / (1000 * 60);
	if (diffInMinutes > 10) {
		throw new ExpiredTokenError();
	}
}