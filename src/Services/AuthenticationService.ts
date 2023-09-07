import { BadREquestError } from "../Errors/BadRequestError";
import { InvalidEmailError } from "../Errors/InvalidEmailError";
import { PassworTooWeakError } from "../Errors/PasswordTooWeakError";
import { UsernameTakenError } from "../Errors/UsernameTakenError";
import { generatePasswordHash, verifyEmailValidity, verifyPasswordStrength, verifyRegistrationDate } from "../Global/CredentialHandler";
import { decodeTokenData, generateJWToken } from "../Global/JWTHandler";
import { User } from "../Models/User";
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
		
		verifyPasswordStrength(password);
		verifyEmailValidity(email);

		const confirmUrl = process.env.HOST + ":" + process.env.PORT + "/api/auth/confirm?token=" + this.generateRegistrationToken(username, password, email);
		return confirmUrl;
	}

	confirmRegistration(token: string) {
		const decodedToken = decodeTokenData(token);
		verifyRegistrationDate(decodedToken.date);
		
		// const username = decodedToken.username;
		// const passwordHash = decodedToken.passwordHash;
		// const email = decodedToken.email;

		return this.userRepository.save(decodedToken)
	}




	private generateRegistrationToken(username: string, password: string, email: string): string {
		return generateJWToken({
			username: username,
			passwordHash: generatePasswordHash(password),
			email: email,
			date: new Date(),
		});
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