import { Model, Types, Document } from "mongoose";
import { IRepository } from "../Models/IRepository";

export class Repository<IDataType extends Document> implements IRepository<IDataType> {

	constructor(protected model: Model<IDataType>) {}

	save(newEntityData: IDataType): Promise<IDataType> {
		const newEntity = new this.model(newEntityData);
		return newEntity.save();
	}
	
	get(entityId: Types.ObjectId): Promise<IDataType | null> {
		return this.model.findById(entityId);
	}

	getQuery(query: any): Promise<IDataType[]> {
		return this.model.find(query);
	}

	getPage(pageSize: number = 0, pageNumber: number = 0): Promise<IDataType[]> {
		return this.model.find({}).skip(pageSize * pageNumber).limit(pageSize);
	}

	update(entityId: Types.ObjectId, entityUpdates: Partial<IDataType>): Promise<IDataType | null> {
		return this.model.findByIdAndUpdate(entityId, entityUpdates, { new: true, runValidators: true }).exec();
	}

	updateQuery(entityId: Types.ObjectId, query: any): Promise<IDataType | null> {
		return this.model.findByIdAndUpdate(entityId, query, { new: true, runValidators: true }).exec();
	}

	updateWithFindQuery(query: any, entityUpdates: Partial<IDataType>): Promise<IDataType | null> {
		return this.model.findOneAndUpdate(query, entityUpdates, { new: true, runValidators: true }).exec();
	}

	remove(entityId: Types.ObjectId): Promise<IDataType | null> {
		return this.model.findByIdAndDelete(entityId).exec();
	}

	exists(query: any): Promise<IDataType | null> {
		// return this.model.exists(query);
		return this.model.findOne(query);
	}

	existsByUsername(username: string): Promise<IDataType | null> {
		return this.model.findOne({ 
			username: { $regex: new RegExp("^" + username + "$", "i") }
		});
	}
	
	aggregate(pipeline: any[]): Promise<IDataType[]> {
		return this.model.aggregate(pipeline).exec();
	}
}

