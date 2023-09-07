import { IUser, User } from "../Models/User";
import { Repository } from "./Repository";

export class UserRepository extends Repository<IUser> {
	constructor() {
		super(User);
	}
};