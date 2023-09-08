import { Types } from "mongoose";
import { IUser, User } from "../Models/User";
import { Repository } from "./Repository";

export class UserRepository extends Repository<IUser> {
	constructor() {
		super(User);
	}

	get(userId: Types.ObjectId): Promise<IUser | null> {
		return this.model.findById(userId).select("-email -passwordHash -admin").exec();
	}

	getQuery(query: any): Promise<IUser[]> {
		return this.model.find(query).select("-email -passwordHash -admin").exec();
	}

	getAll(): Promise<IUser[]> {
		return this.model.find({}).select("-email -passwordHash -admin").exec();
	}

	aggregate(pipeline: any[]): Promise<IUser[]> {
		pipeline.push({ $project: { email: 0, passwordHash: 0, admin: 0 } });
		return this.model.aggregate(pipeline).exec();
	}
};