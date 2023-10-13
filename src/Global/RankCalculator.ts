const popularityTreshold = 20; // nr of players that need to have played the map for it to be considered popular => maximum rank
const tresholdConstant = popularityTreshold / 2;
const formulaSteepness = 5 / popularityTreshold;
const maximumScore = 1000;


const popularityMultiplier = (x: number) => {
	return 1 / (1 + Math.exp(-formulaSteepness * (x - tresholdConstant)));
};
export const calculateGlobalScore = (placement: number, popularity: number): number => {
	return Math.round(1/placement * popularityMultiplier(popularity) * maximumScore);
};
