import { Types } from "mongoose";

export const createObjectId = (id: string) => {
	try {
		return new Types.ObjectId(id);
	} catch (error) {
		return new Types.ObjectId();
	}
}