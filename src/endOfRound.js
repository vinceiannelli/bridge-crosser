import { welcome } from './welcome.js';
import { newRound } from './newRound.js';
import { term, playerWins, round } from './index.js';

export function endOfRound() {
	// deteremine win or loss and do things
	term.nextLine(1);
	// readlineSync.question('Press enter to continue.');
	if (playerWins) {
		round++;
		newRound();
	} else {
		welcome();
		newRound();
	}
}
