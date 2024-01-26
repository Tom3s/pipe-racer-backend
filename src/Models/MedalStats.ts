import { Types } from "mongoose";

export class MedalStats {
	constructor(
		public userId: Types.ObjectId,

		public chronoMedals: number = 0,
		public totalGoldMedals: number = 0,
		public totalSilverMedals: number = 0,
		public totalBronzeMedals: number = 0,

		public blitzMedals: number = 0,
		public lapGoldMedals: number = 0,
		public lapSilverMedals: number = 0,
		public lapBronzeMedals: number = 0,
	) { }
}