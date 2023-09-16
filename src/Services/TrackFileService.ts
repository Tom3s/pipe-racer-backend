import fs from "fs";
import path from "path";
import { UploadingTrackError } from "../Errors/UploadingTrackError";
import { validateTrackFormat } from "./TrackFormatValidatorService";
import { TrackNotFoundError } from "../Errors/TrackNotFoundError";

export class TrackFileService {
	constructor(
		private readonly trackFileDirectory: string = path.join(__dirname, "../../public/tracks")
	) {}

	public async saveTrackFile(track: any, trackId: string): Promise<void> {
		validateTrackFormat(track);
		return fs.writeFile(`${this.trackFileDirectory}/${trackId}.json`, JSON.stringify(track), (error) => {
			if (error) {
				throw new UploadingTrackError(error);
			}
		});
	}

	getTrackFile(trackId: string): string {
		const trackPath = `${this.trackFileDirectory}/${trackId}.json`;
		if (!fs.existsSync(trackPath)) {
			throw new TrackNotFoundError();
		}
		return trackPath;
	}

	deleteTrackFile(trackId: string): void {
		const trackPath = `${this.trackFileDirectory}/${trackId}.json`;
		if (!fs.existsSync(trackPath)) {
			throw new TrackNotFoundError();
		}
		fs.unlinkSync(trackPath);
	}
}