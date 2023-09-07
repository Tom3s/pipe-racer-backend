import { UserRepository } from "../Repositories/UserRepository";
import { ImageFileService } from "./ImageFileService";

export class UserService {
	private userRepository: UserRepository;

	constructor(userRepository: UserRepository) {
		this.userRepository = userRepository;
	}
}