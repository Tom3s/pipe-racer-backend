import { ExpiredRegistrationTokenError } from "../Errors/ExpiredRegistrationTokenError";
import { ExpiredTokenError } from "../Errors/ExpiredTokenError";
import { InvalidCharacterError } from "../Errors/InvalidCharacterError";
import { InvalidEmailError } from "../Errors/InvalidEmailError";
import { PassworTooWeakError } from "../Errors/PasswordTooWeakError";

export const verifyPasswordStrength = (password: string) => {
	if (password.length < 8) {
		throw new PassworTooWeakError();
	}

	let hasUpperCase = false;
	let hasLowerCase = false;
	let hasSpecialChar = false;

	const aLower = 'a'.charCodeAt(0);
	const zLower = 'z'.charCodeAt(0);
	const aUpper = 'A'.charCodeAt(0);
	const zUpper = 'Z'.charCodeAt(0);

	for (let i = 0; i < password.length; i++) {
		const ascii = password.charCodeAt(i);
		if (ascii < 32) {
			throw new InvalidCharacterError();
		}

		if (ascii >= aLower && ascii <= zLower) {
			hasLowerCase = true;
		} else if (ascii >= aUpper && ascii <= zUpper) {
			hasUpperCase = true;
		} else {
			hasSpecialChar = true;
		}
	}

	if (!hasUpperCase || !hasLowerCase || !hasSpecialChar) {
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