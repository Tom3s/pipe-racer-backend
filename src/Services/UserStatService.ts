import { Types } from "mongoose";
import { TrackStatService } from "./TrackStatService";
import { IUserStats } from "../Models/UserStats";
import { TrackService } from "./TrackService";
import { RatingService } from "./RatingService";
import { ITrackStat } from "../Models/TrackStat";
import { createObjectId } from "../Global/CreateObjectId";

export class UserStatService {
	constructor(
		private trackStatService: TrackStatService,
		private trackService: TrackService,
		private ratingService: RatingService,
	) { }

	// CREATE - none
	// READ

	getAllTrackStats(): Promise<ITrackStat[]> {
		return this.trackStatService.getAllTrackStats();
	}

	async getGlobalStatsForUser(userId: Types.ObjectId): Promise<IUserStats> {
		const trackStats = await this.trackStatService.getStatsForUser(userId);
		const tracks = await this.trackService.getTracksByUser(userId);
		const ratings = await this.ratingService.getRatingsByUser(userId);

		// sum(stat.playtime)
		const ingamePlaytime = trackStats.reduce((sum, stat) => {
			return sum + stat.playtime;
		}, 0);
		// sum(stat.editorPlaytime)
		const editorPlaytime = 0;

		// sum(stat.nrAttempts)
		const totalAttempts = trackStats.reduce((sum, stat) => {
			return sum + stat.nrAttempts;
		}, 0);
		// sum(stat.nrFinishes)
		const totalFinishes = trackStats.reduce((sum, stat) => {
			return sum + stat.nrFinishes;
		}, 0);

		// max(number of times track was played)
		const trackPlaytimes = {} as Record<string, number>;

		trackStats.forEach((trackStat) => {
			const { track, playtime } = trackStat;
			const trackId = track.toHexString();
			if (trackPlaytimes[trackId] !== undefined) {
				trackPlaytimes[trackId] += playtime;
			} else {
				trackPlaytimes[trackId] = playtime;
			}
		});

		const [mostPlayedTrack, mostPlayedTrackTime] = Object.entries(trackPlaytimes).reduce((max, entry) => {
			return entry[1] > max[1] ? entry : max;
		}, ["", 0]);
		// uploadedTracks.length
		const tracksUploaded = tracks.length;

		const tracksPlayed = Object.keys(trackPlaytimes).length;

		const tracksRated = ratings.length;

		const mostPlayedTrackId = createObjectId(mostPlayedTrack);

		const mostPlayedTrackObject = await this.trackService.getTrack(mostPlayedTrackId);

		return {
			user: userId,
			mostPlayedTrack: mostPlayedTrackObject,
			totalPlaytime: ingamePlaytime + editorPlaytime,
			ingamePlaytime: ingamePlaytime,
			editorPlaytime: editorPlaytime,
			tracksUploaded: tracksUploaded,
			tracksPlayed: tracksPlayed,
			tracksRated: tracksRated,
			totalAttempts: totalAttempts,
			totalFinishes: totalFinishes,
		} as IUserStats;

	}
}