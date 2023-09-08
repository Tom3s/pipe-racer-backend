import { Types } from "mongoose";
import { UserRepository } from "../Repositories/UserRepository";
import { ImageFileService } from "./ImageFileService";

export class UserService {
	private userRepository: UserRepository;

	constructor(userRepository: UserRepository) {
		this.userRepository = userRepository;
	}

	public async getUserById(userId: Types.ObjectId) {
		return this.userRepository.get(userId);
	}

	public async getUserByUsername(username: string) {
		return this.userRepository.getQuery({ username: username });
	}

	public async getAllUsers() {
		return this.userRepository.getAll();
	}
}