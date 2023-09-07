export abstract class ResponseError extends Error {
	abstract statusCode: number;
	constructor(message: string) {
		super(message);
		this.name = this.constructor.name;
	}
}