interface ITextBlocks {
	INVALID_USER_ID: string;
	LOGIN_ERROR_INVALID_USERNAME: string;
	LOGIN_ERROR_INVALID_PASSWORD: string;
}

export const translations: { [key: string]: ITextBlocks } = {
	eng: {
		INVALID_USER_ID: "Invalid user ID",
		LOGIN_ERROR_INVALID_USERNAME: "Invalid username",
		LOGIN_ERROR_INVALID_PASSWORD: "Invalid password",
	},
	hun: {
		INVALID_USER_ID: "Érvénytelen felhasználói azonosító",
		LOGIN_ERROR_INVALID_USERNAME: "Érvénytelen felhasználónév",
		LOGIN_ERROR_INVALID_PASSWORD: "Érvénytelen jelszó",
	}
};