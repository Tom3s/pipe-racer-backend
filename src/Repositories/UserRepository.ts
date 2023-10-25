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

	getPage(pageSize: number = 0, pageNumber: number = 0): Promise<IUser[]> {
		return this.model.find({}).skip(pageSize * pageNumber).limit(pageSize).select("-email -passwordHash -admin").exec();
	}

	aggregate(pipeline: any[]): Promise<IUser[]> {
		pipeline.push({ $project: { email: 0, passwordHash: 0, admin: 0 } });
		return this.model.aggregate(pipeline).exec();
	}

	update(entityId: Types.ObjectId, entityUpdates: Partial<IUser>): Promise<IUser | null> {
		return this.model.findByIdAndUpdate(entityId, entityUpdates, { new: true, runValidators: true }).select("-passwordHash -admin").exec();
	}

	remove(entityId: Types.ObjectId): Promise<IUser | null> {
		return this.model.findByIdAndDelete(entityId).select("-passwordHash -admin").exec();
	}
};