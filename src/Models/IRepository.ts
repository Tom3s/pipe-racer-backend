import { Types, Document } from "mongoose";

export interface IRepository<DataType extends Document> {
	save(newData: DataType): Promise<DataType>;
	get(dataId: Types.ObjectId): Promise<DataType | null>;
	getQuery(query: any): Promise<DataType[]>
	getAll(): Promise<DataType[]>;
	update(dataId: Types.ObjectId, dataUpdates: DataType): Promise<DataType | null>;
	updateQuery(dataId: Types.ObjectId, query: any): Promise<DataType | null>;
	updateWithFindQuery(query: any, entityUpdates: Partial<DataType>): Promise<DataType | null>
	remove(dataId: Types.ObjectId): Promise<DataType | null>;
	exists(query: any): Promise<DataType | null>;
	aggregate(pipeline: any[]): Promise<DataType[]>;
};