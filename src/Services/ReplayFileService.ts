import fs from "fs";
import path from "path";
import { UploadingReplayError } from "../Errors/UploadingReplayError";
import { InvalidReplayError } from "../Errors/InvalidReplayError";

export class ReplayFileService {
	private replayFileDirectory = "../../public/replays";

	public async saveReplayFile(file: Buffer, replayId: string): Promise<void> {
		const fileName = path.join(__dirname, `${this.replayFileDirectory}/${replayId}.replay`);
		// fs.writeFileSync(fileName, file);
		return fs.writeFile(fileName, file, (error) => {
			if (error) {
				throw new UploadingReplayError(error);
			}
		});
	}

	public getReplayFile(replayId: string): string {
		const fileName = path.join(__dirname, `${this.replayFileDirectory}/${replayId}.replay`);
		if (!fs.existsSync(fileName)) {
			throw new InvalidReplayError(replayId);
		}
		return fileName;
	}
}