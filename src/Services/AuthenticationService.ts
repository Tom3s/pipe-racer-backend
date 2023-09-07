import { BadREquestError } from "../Errors/BadRequestError";
import { InvalidCredentialsError } from "../Errors/InvalidCredentialsError";
import { InvalidEmailError } from "../Errors/InvalidEmailError";
import { PassworTooWeakError } from "../Errors/PasswordTooWeakError";
import { UsernameTakenError } from "../Errors/UsernameTakenError";
import { generatePasswordHash, verifyEmailValidity, verifyPasswordStrength, verifyTokenExpirationDate } from "../Global/CredentialHandler";
import { decodeTokenData, generateJWToken } from "../Global/JWTHandler";
import { ClientSessionData, SessionData } from "../Models/SessionData";
import { IUser, User } from "../Models/User";
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
		verifyTokenExpirationDate(decodedToken.date);

		return this.userRepository.save(decodedToken)
	}

	async login(username: string, password: string): Promise<ClientSessionData> {
		return this.userRepository.exists({
			username: username,
			passwordHash: generatePasswordHash(password)
		})
		.then((foundUser) => {
			if (!foundUser) {
				throw new InvalidCredentialsError();
			}
			const loginDate = new Date();
			return new ClientSessionData(foundUser, loginDate.toISOString(), this.generateSessionToken(username, foundUser, loginDate));
		})
	}



	private generateRegistrationToken(username: string, password: string, email: string): string {
		return generateJWToken({
			username: username,
			passwordHash: generatePasswordHash(password),
			email: email,
			date: new Date(),
		});
	}

	private generateSessionToken(username: string, foundUser: IUser, loginDate: Date): string {
		// return generateJWToken(new SessionData(
		// 	username,
		// 	foundUser._id.toHexString(),
		// 	foundUser.admin,
		// 	loginDate
		// ).to);
		return generateJWToken({
			username: username,
			userId: foundUser._id.toHexString(),
			admin: foundUser.admin,
			loginDate: loginDate
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

	static verifySessionToken(token: string): SessionData {
		const decodedToken = decodeTokenData(token);
		return SessionData.fromTokenData(
			decodedToken
		);
	}
}