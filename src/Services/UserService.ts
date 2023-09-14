import { Types } from "mongoose";
import { UserRepository } from "../Repositories/UserRepository";
import { ImageFileService } from "./ImageFileService";

export class UserService {
	private userRepository: UserRepository;

	constructor(userRepository: UserRepository) {
		this.userRepository = userRepository;
	}

	public async getUserById(userId: Types.ObjectId) {
		const user = await this.userRepository.get(userId);
		return {
			...user?.toObject(),
			profilePictureUrl: process.env.HOST + ":" + process.env.PORT + "/api/users/picture/" + user?._id.toHexString()
		}
	}

	public async getUserByUsername(username: string) {
		return this.userRepository.getQuery({ username: username });
	}

	public async getAllUsers() {
		return this.userRepository.getAll();
	}
}