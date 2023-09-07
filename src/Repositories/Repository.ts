import { Model, Types, Document } from "mongoose";
import { IRepository } from "../Models/IRepository";

export class Repository<IDataType extends Document> implements IRepository<IDataType> {

	constructor(private model: Model<IDataType>) {}

	save(newEntityData: IDataType): Promise<IDataType> {
		const newEntity = new this.model(newEntityData);
		return newEntity.save();
	}
	
	get(entityId: Types.ObjectId): Promise<IDataType | null> {
		return this.model.findById(entityId);
	}

	getAll(): Promise<IDataType[]> {
		return this.model.find({});
	}

	update(entityId: Types.ObjectId, entityUpdates: Partial<IDataType>): Promise<IDataType | null> {
		return this.model.findByIdAndUpdate(entityId, entityUpdates, { new: true });
	}

	remove(entityId: Types.ObjectId): Promise<IDataType | null> {
		return this.model.findByIdAndDelete(entityId);
	}
	
}

