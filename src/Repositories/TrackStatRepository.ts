import { ITrackStat, TrackStat } from "../Models/TrackStat";
import { Repository } from "./Repository";

export class TrackStatRepository extends Repository<ITrackStat> {
	constructor() {
		super(TrackStat);
	}
};