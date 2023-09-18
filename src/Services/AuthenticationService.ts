import { BadREquestError } from "../Errors/BadRequestError";
import { EmailAlreadyConfirmedError } from "../Errors/EmailAlreadyConfirmedError";
import { EmailTakenError } from "../Errors/EmailTakeError";
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
		await this.userRepository.existsByUsername(username)
		.then((foundUser) => {
			if (foundUser?.guest === false) {
				throw new UsernameTakenError();
			}
		})

		await this.userRepository.exists({
			email: email
		})
		.then((foundUser) => {
			if (foundUser) {
				throw new EmailTakenError();
			}
		})
		
		verifyPasswordStrength(password);
		verifyEmailValidity(email);

		// const confirmUrl = process.env.HOST + ":" + process.env.PORT + "/api/auth/confirm?token=" + this.generateRegistrationToken(username, password, email);
		const confirmUrl = process.env.WEBSITE + "/confirm?token=" + this.generateRegistrationToken(username, password, email.toLowerCase());
		console.log(confirmUrl);
		return confirmUrl;
	}

	confirmRegistration(token: string) {
		const decodedToken = decodeTokenData(token);
		verifyTokenExpirationDate(decodedToken.date);

		decodedToken.guest = false;

		return this.userRepository.existsByUsername(decodedToken.username)
		.then((foundUser) => {
			if (foundUser && foundUser.guest === true) {
				return this.userRepository.update(foundUser._id, decodedToken);
			} else if (!foundUser){
				return this.userRepository.save(decodedToken);
			}
			throw new EmailAlreadyConfirmedError();
		})
	}

	login(username: string, password: string): Promise<ClientSessionData> {
		return this.userRepository.exists({
			username: { $regex: new RegExp("^" + username + "$", "i")},
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

	loginAsGuest(username: string): Promise<ClientSessionData> {
		return this.userRepository.existsByUsername(username)
		.then(async (foundUser) => {
			if (!foundUser) {
				foundUser = await this.userRepository.save({
					username: username,
					passwordHash: "",
					email: "",
					guest: true,
				} as IUser);
			} else if (!foundUser.guest) {
				throw new UsernameTakenError();
			}
			const loginDate = new Date();
			return new ClientSessionData(foundUser, loginDate.toISOString(), this.generateSessionToken(username, foundUser, loginDate), true);
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