import { Types } from "mongoose";
import { TrackStatService } from "./TrackStatService";
import { IUserStats } from "../Models/UserStats";
import { TrackService } from "./TrackService";
import { RatingService } from "./RatingService";
import { ITrackStat } from "../Models/TrackStat";
import { createObjectId } from "../Global/CreateObjectId";
import { EditorStatService } from "./EditorStatService";
import { GlobalScoreService } from "./GlobalScoreService";
import { IGlobalScore } from "../Models/GlobalScore";
import { ITrack } from "../Models/Track";
import { IUser } from "../Models/User";
import { CollectedMedalService } from "./CollectedMedalService";

export class UserStatService {
	constructor(
		private trackStatService: TrackStatService,
		private editorStatService: EditorStatService,
		private trackService: TrackService,
		private ratingService: RatingService,
		private globalScoreService: GlobalScoreService,
		private collectedMedalService: CollectedMedalService,
	) { }

	// CREATE - none
	// READ

	getAllTrackStats(): Promise<ITrackStat[]> {
		return this.trackStatService.getAllTrackStats();
	}

	async getGlobalStatsForUser(userId: Types.ObjectId): Promise<IUserStats> {
		const trackStats = await this.trackStatService.getStatsForUser(userId);
		const editorStats = await this.editorStatService.getStatsForUser(userId);
		const tracks = await this.trackService.getTracksByUser(userId);
		const ratings = await this.ratingService.getRatingsByUser(userId);
		const medals = await this.collectedMedalService.getMedalsForUser(userId);

		// sum(stat.playtime)
		const ingamePlaytime = trackStats.reduce((sum, stat) => {
			return sum + stat.playtime;
		}, 0);
		// sum(stat.editorPlaytime)
		const editorPlaytime = editorStats.reduce((sum, stat) => {
			return sum + stat.editorTime;
		}, 0);

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

		const mostPlayedTrackObject = await this.trackService.getTrack(mostPlayedTrackId)
			.catch((error) => {
				return {
					name: "None",
					author: {
						username: "Unknown",
						admin: false,
						guest: false,
					} as IUser,
				} as ITrack;
			});
		const placedTrackPieces = editorStats.reduce((sum, stat) => {
			return sum + stat.placedTrackPieces;
		}, 0);
		const placedCheckpoints = editorStats.reduce((sum, stat) => {
			return sum + stat.placedCheckpoints;
		}, 0);
		const placedProps = editorStats.reduce((sum, stat) => {
			return sum + stat.placedProps;
		}, 0);
		const placedAll = placedTrackPieces + placedCheckpoints + placedProps;

		const nrTests = editorStats.reduce((sum, stat) => {
			return sum + stat.nrTests;
		}, 0);

		const globalScores = await this.globalScoreService.getAllGlobalScores();

		// console.log("globalScores", globalScores);

		// const globalScore = globalScores.find((score) => score.user.toHexString() === userId.toHexString());
		const globalScoreIndex = globalScores.findIndex((score) => score.user._id.toHexString() === userId.toHexString());

		const globalScore = globalScoreIndex !== -1 ? globalScores[globalScoreIndex] : {
			scoreTime: -1,
			scoreLaps: -1,
			score: -1,
			globalRank: -1,
		} as IGlobalScore;


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
			placedTrackPieces: placedTrackPieces,
			placedCheckpoints: placedCheckpoints,
			placedProps: placedProps,
			placedAll: placedAll,
			nrTests: nrTests,
			globalScore: globalScore,

			chronoMedals: medals.chronoMedals,
			totalGoldMedals: medals.totalGoldMedals,
			totalSilverMedals: medals.totalSilverMedals,
			totalBronzeMedals: medals.totalBronzeMedals,
			blitzMedals: medals.blitzMedals,
			lapGoldMedals: medals.lapGoldMedals,
			lapSilverMedals: medals.lapSilverMedals,
			lapBronzeMedals: medals.lapBronzeMedals,
		} as IUserStats;

	}
}