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
			profilePictureUrl: process.env.WEBSITE + "/api/users/picture/" + user?._id.toHexString()
		}
	}

	async getUserByUsername(username: string): Promise<IUser[]> {
		return this.userRepository.getQuery({ username: username });
	}

	async getUserPage(pageSize: number = 0, pageNumber: number = 0): Promise<IUser[]> {
		return this.userRepository.getPage(pageSize, pageNumber);
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