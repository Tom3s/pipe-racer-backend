import fs from "fs";

export class ImageFileService {
	private profilePicturePath = "public/images/profilePictures";

	public saveProfilePictureJPG(file: Buffer, userId: string) {
		const fileName = `${this.profilePicturePath}/${userId}.jpg`
		fs.writeFileSync(fileName, file);
	}

	public saveProfilePicturePNG(file: Buffer, userId: string) {
		const fileName = `${this.profilePicturePath}/${userId}.png`
		fs.writeFileSync(fileName, file);
	}
};
