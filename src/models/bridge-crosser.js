import { HiScore } from '../server.js';
import { bcScore } from '../server.js';

export async function getHiScoreDB() {
	const score = await HiScore.findOne();
	bcScore.playerScore = score.playerScore;
	bcScore.playerName = score.playerName;
	return bcScore;
}

export function generateTileSequence(bridgeLength, bridgeWidth) {
	const crossSequence = [];
	for (let row = 0; row < bridgeLength; row++) {
		if (row === 0) {
			crossSequence[row] = Math.floor(Math.random() * bridgeWidth + 1);
		} else {
			crossSequence[row] = Math.floor(Math.random() * bridgeWidth + 1);
			// ensure next row is within one tile
			while (
				crossSequence[row] >= crossSequence[row - 1] + 2 ||
				crossSequence[row] <= crossSequence[row - 1] - 2
			) {
				crossSequence[row] = Math.floor(Math.random() * bridgeWidth + 1);
			}
		}
	}
	return crossSequence;
}
