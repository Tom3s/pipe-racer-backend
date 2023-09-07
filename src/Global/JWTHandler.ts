export const generateJWToken = (data: any): string => {
	const jwt = require('jsonwebtoken');
	const jwtSecret = process.env.JWT_SECRET_KEY;
	data.date = new Date();
	return jwt.sign(data, jwtSecret);
}

export const decodeTokenData = (token: string): any => {
	const jwt = require('jsonwebtoken');
	const jwtSecret = process.env.JWT_SECRET_KEY;
	return jwt.verify(token, jwtSecret);
}