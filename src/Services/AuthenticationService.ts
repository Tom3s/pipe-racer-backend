import { BadREquestError } from "../Errors/BadRequestError";
import { InvalidEmailError } from "../Errors/InvalidEmailError";
import { PassworTooWeakError } from "../Errors/PasswordTooWeakError";
import { UsernameTakenError } from "../Errors/UsernameTakenError";
import { generateJWToken } from "../Global/JWTHandler";
import { UserRepository } from "../Repositories/UserRepository";

export class AuthenticationService {
	constructor(private userRepository: UserRepository) {}

	async getRegistrationToken(username: string, password: string, email: string): Promise<string> {
		this.verifyFieldsForRegistration(username, password, email);
		await this.userRepository.exists({
			username: username
		})
		.then((foundUser) => {
			if (foundUser) {
				throw new UsernameTakenError();
			}
		})
		
		this.verifyPasswordStrength(password);
		this.verifyEmailValidity(email);

		return this.generateRegistrationToken(username, password, email);
	}

	private verifyPasswordStrength(password: string) {
		const regex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[\d@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
        if (!regex.test(password)) {
			throw new PassworTooWeakError();
		}
	}

	private verifyEmailValidity(email: string) {
		const regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
		if (!regex.test(email)) {
			throw new InvalidEmailError();
		}
	}

	private generateRegistrationToken(username: string, password: string, email: string): string {
		return generateJWToken({
			username: username,
			passwordHash: this.generatePasswordHash(password),
			email: email,
			date: new Date(),
		});
	}

	private generatePasswordHash(password: string): string {
		const { createHash } = require('crypto');

        return createHash('sha256').update(password).digest('hex');
	}

	private verifyFieldsForRegistration(username: string, password: string, email: string): void {
		const missingFields = [];
		if (!username) {
			missingFields.push("username");
		}
		if (!password) {
			missingFields.push("password");
		}
		if (!email) {
			missingFields.push("email");
		}
		if (missingFields.length > 0) {
			throw new BadREquestError(missingFields);
		}
	}
}