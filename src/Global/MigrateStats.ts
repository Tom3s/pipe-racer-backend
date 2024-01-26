import { CompletedRun, ICompletedRun } from "../Models/CompletedRun";
import { Track } from "../Models/Track";
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

export const updateMapsFrom2To3 = () => {
	const fs = require('fs');
	const path = require('path');

	const mappingFilePath = path.join(__dirname, '../../src/Global/mappings.json');
	let mappings = JSON.parse(fs.readFileSync(mappingFilePath, 'utf8'));

	Track.find({}).then((tracks) => {
		tracks.forEach((track) => {
			const filePath = path.join(__dirname, '../../public/tracks', track._id.toString() + '.json');

			let jsonData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
			if (jsonData.format !== 2) return;
			
			let currentMapping = mappings.find((mapping: any) => mapping.mapId === track._id.toString());

			if (currentMapping === undefined) {
				console.log(`No mapping found for track ${track._id.toString()}`);
				return;
			}

			jsonData.format = 3;
			jsonData.bestTotalTime = currentMapping.bestTotalTime;
			jsonData.bestLapTime = currentMapping.bestLapTime;
			jsonData.betTotalReplay = currentMapping.bestTotalReplay;
			jsonData.bestLapReplay = currentMapping.bestLapReplay;

			fs.writeFileSync(filePath, JSON.stringify(jsonData));

			track.bestTotalTime = currentMapping.bestTotalTime;
			track.bestLapTime = currentMapping.bestLapTime;
			track.bestTotalReplay = currentMapping.bestTotalReplay;
			track.bestLapReplay = currentMapping.bestLapReplay;

			track.save();

			console.log(`Updated track ${track._id.toString()}`);
		});
	});
	console.log('Done updating maps');
}