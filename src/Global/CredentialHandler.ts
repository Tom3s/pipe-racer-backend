import { ExpiredRegistrationTokenError } from "../Errors/ExpiredRegistrationTokenError";
import { ExpiredTokenError } from "../Errors/ExpiredTokenError";
import { InvalidCharacterError } from "../Errors/InvalidCharacterError";
import { InvalidEmailError } from "../Errors/InvalidEmailError";
import { PassworTooWeakError } from "../Errors/PasswordTooWeakError";

function isAlphaLower(char: string) {
	return (char.charCodeAt(0) >= 'a'.charCodeAt(0) && char.charCodeAt(0) <= 'z'.charCodeAt(0));
}

function isNumeric(char: string) {
	return char.charCodeAt(0) >= '0'.charCodeAt(0) && char.charCodeAt(0) <= '9'.charCodeAt(0);
}

function isDot(char: string) {
	return char.charCodeAt(0) === '.'.charCodeAt(0);
}

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
	// const regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
	// if (!regex.test(email)) {
	// 	throw new InvalidEmailError();
	// }
	const split = email.toLowerCase().split('@');
	if (split.length !== 2) {
		throw new InvalidEmailError();
	}

	const [local, domain] = split;

	if (local.length === 0 || domain.length === 0) {
		throw new InvalidEmailError();
	}
	
	let lastPeriodPos: number = -1;
	for (let i = 0; i < local.length; i++) {
		const char = local.charAt(i);
		if (i === 0 || i === (local.length - 1)) {
			if (!isAlphaLower(char)) {
				throw new InvalidEmailError();
			}
		} else {
			if (!isAlphaLower(char) && !isNumeric(char) && !isDot(char)) {
				throw new InvalidEmailError();
			}
			if (char === '.') {
				if (i === (lastPeriodPos + 1)) {
					throw new InvalidEmailError();
				}
				lastPeriodPos = i;
			}
		}
	}

	const domainSplit = domain.split('.');

	if (domainSplit.length !== 2) {
		throw new InvalidEmailError();
	}

	// const [domainName, tld] = domainSplit;

	// TODO: verify domain name and tld
	// Note: invalid domain names will just result in no registration
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