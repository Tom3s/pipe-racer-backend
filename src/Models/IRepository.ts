import { Types, Document } from "mongoose";

export interface IRepository<DataType extends Document> {
	save(newData: DataType): Promise<DataType>;
	get(dataId: Types.ObjectId): Promise<DataType | null>;
	getAll(): Promise<DataType[]>;
	update(dataId: Types.ObjectId, dataUpdates: DataType): Promise<DataType | null>;
	remove(dataId: Types.ObjectId): Promise<DataType | null>;
};