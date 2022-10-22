import readlineSync from 'readline-sync';
import chalk from 'chalk';
import sound from 'sound-play';
import fetch from 'node-fetch';
import { bridgeWidth, term, bridgeLength, crossSequence, round, hiScore, playerWins } from './index';
import { endOfRound } from './endOfRound';

export async function playerMoves() {
	// positioning of cursor / player
	let tilePosition = 1;
	let rowPosition = -1;

	// constraining lateral movement
	const MAX = bridgeWidth;
	const MIN = 1;

	// keyboard input
	let key;

	//MOVE CURSOR TO TOP
	term.up(bridgeLength + 1);
	term.right(4);

	while (true) {
		key = readlineSync.keyIn('', { hideEchoBack: true, mask: '', limit: 'azxcd' });
		// LEFT
		if (key === 'a') {
			if (tilePosition > MIN) {
				tilePosition--;
				term.left(2);
			}
			// RIGHT
		} else if (key === 'd') {
			if (tilePosition < MAX) {
				tilePosition++;
				term.right(2);
			}
			// DOWN
		} else if (key === 'x') {
			term.down(1);
			rowPosition++;
			// DOWN-LEFT DIAGONAL
		} else if (key === 'z') {
			if (tilePosition > MIN) {
				tilePosition--;
				term.down(1);
				term.left(2);
				rowPosition++;
			}
			// DOWN-RIGHT DIAGONAL
		} else if (key === 'c') {
			if (tilePosition < MAX) {
				tilePosition++;
				term.down(1);
				term.right(2);
				rowPosition++;
			}
		} else {
			break;
		}

		// If player reaches other side
		if (rowPosition >= bridgeLength) {
			term.nextLine(1);
			term.green('ROUND COMPLETED!\n');
			readlineSync.question('Press enter for next round.');
			break;
		}

		// If player steps on safe tile
		if (tilePosition === crossSequence[rowPosition]) {
			// Draw colored tile to reveal pattern
			process.stdout.write(`${chalk.green('*')}`);
			term.left(1); // move back after printing green star

			// SOUND - play seq based on tile
			sound.play(`../audio/${crossSequence[rowPosition]}.mp3`, { volume: 1 });
		}

		// If player steps on bad tile
		else if (rowPosition >= 0) {
			// SOUND - death
			sound.play(`../audio/fall.mp3`, { volume: 1 });
			// draw a HOLE
			console.log('O');
			// move cursor to bottom of bridge
			term.nextLine(bridgeLength - rowPosition);
			console.log(`${chalk.red('YOU STEPPED ON THE WRONG TILE!')}`);

			// Enter new Hi Score
			if (round > hiScore.score) {
				hiScore.name = readlineSync.question('YOU GOT A HI SCORE! \n\nEnter your name:');
				hiScore.score = round;
				// send hi score to SERVER
				const response = await fetch(
					`http://localhost:4000/newHiScore?player=${hiScore.name}&score=${hiScore.score}`
				);
				await response.json();
			}
			readlineSync.question('Press enter to start a new game.');
			playerWins = false;
			break;
		}
	}

	endOfRound();
}
