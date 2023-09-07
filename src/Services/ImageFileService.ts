import fs from "fs";
import path from "path";


export class ImageFileService {
	private profilePicturePath = "../../public/images/profilePictures";
	private defaultProfilePicturePath = "../../public/images/profilePictures/default.jpg";

	public saveProfilePictureJPG(file: Buffer, userId: string) {
		const fileName = path.join(__dirname, `${this.profilePicturePath}/${userId}.jpg`);
		fs.writeFileSync(fileName, file);
	}

	public saveProfilePicturePNG(file: Buffer, userId: string) {
		const fileName = path.join(__dirname, `${this.profilePicturePath}/${userId}.png`);
		fs.writeFileSync(fileName, file);
	}

	public getProfilePicture(userId: string): string {
		// const jpgFileName = `${this.profilePicturePath}/${userId}.jpg`;
		// const pngFileName = `${this.profilePicturePath}/${userId}.png`;

		const jpgFileName = path.join(__dirname, `${this.profilePicturePath}/${userId}.jpg`);
		const pngFileName = path.join(__dirname, `${this.profilePicturePath}/${userId}.png`);

		if (fs.existsSync(jpgFileName)) {
			return jpgFileName;
			// return path.join(__dirname, jpgFileName)
		} else if (fs.existsSync(pngFileName)) {
			return pngFileName;
			// return path.join(__dirname, pngFileName)
		} else {
			// return this.defaultProfilePicturePath;
			return path.join(__dirname, this.defaultProfilePicturePath)
		}
	}
};
