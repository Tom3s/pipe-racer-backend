import { CompletedRun, ICompletedRun } from "../Models/CompletedRun";
import { TrackStat } from "../Models/TrackStat";

export const migrateCompletedRunsToStats = () => { CompletedRun.find({}).then((runs) => {

	runs.forEach((run: ICompletedRun) => {
		// const newTrackStat = {
		// 	user: run.user,
		// 	track: run.track,
		// 	playtime: run.time !== undefined ? run.time * 1.2 : 0,
		// 	nrAttempts: 2,
		// 	nrFinishes: 1,
		// 	bestLap: run.bestLap,
		// 	bestTime: run.time,
		// } as ITrackStat;

		const newTrackStat = new TrackStat({
			user: run.user,
			track: run.track,
			playtime: run.time !== undefined ? Math.floor(run.time * 1.2 / 1000 / 60) : 0,
			nrAttempts: 2,
			nrFinishes: 1,
			bestLap: run.bestLap,
			bestTime: run.time,
		});
		newTrackStat.save();
	});
});
}