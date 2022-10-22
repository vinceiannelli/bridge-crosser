import { welcome } from './welcome';
import { newRound } from './newRound';
import { term, playerWins, round } from './index';

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
