import { Types } from "mongoose";
import { UserRepository } from "../Repositories/UserRepository";
import { ImageFileService } from "./ImageFileService";
import { generatePasswordHash, verifyEmailValidity, verifyPasswordStrength } from "../Global/CredentialHandler";
import { IUser } from "../Models/User";

export class UserService {
	private userRepository: UserRepository;

	constructor(userRepository: UserRepository) {
		this.userRepository = userRepository;
	}

	async getUserById(userId: Types.ObjectId): Promise<Partial<IUser>> {
		const user = await this.userRepository.get(userId);
		return {
			...user?.toObject(),
			profilePictureUrl: process.env.HOST + ":" + process.env.PORT + "/api/users/picture/" + user?._id.toHexString()
		}
	}

	async getUserByUsername(username: string): Promise<IUser[]> {
		return this.userRepository.getQuery({ username: username });
	}

	async getAllUsers(): Promise<IUser[]> {
		return this.userRepository.getAll();
	}

	async updateUser(userId: Types.ObjectId, userUpdates: any): Promise<IUser | null> {
		if (userUpdates.password !== undefined) {
			verifyPasswordStrength(userUpdates.password);
			userUpdates.passwordHash = generatePasswordHash(userUpdates.password)
		}
		if (userUpdates.email !== undefined) {
			verifyEmailValidity(userUpdates.email);
		}

		return this.userRepository.update(userId, userUpdates);
	}

	async deleteUser(userId: Types.ObjectId): Promise<IUser | null> {
		return this.userRepository.remove(userId);
	}
}