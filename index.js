import readlineSync from 'readline-sync';
import Afplay from 'afplay';
import chalk from 'chalk';
import tk from 'terminal-kit';

let player = new Afplay();

const bridgeWidth = 4;
let bridgeLength = 1;
const crossSequence = [];
let playerWins = false;

function welcome() {
	console.log(`
    
    
    
      **** WELCOME TO BRIDGE CROSSER ****
      
      
      
      
    `);
	readlineSync.question('Press enter to continue. WELCOME');
}

function newRound() {
	bridgeLength++;
	// GENERATE SEQUENCE
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
	console.log('cross sequence: ', crossSequence);
	// draw bridge, row by row, playing sequence elements, spaced by x time in ms
	// for each element of crossSeq, read element, play sound, draw row with colored tile, draw blank row

	// DRAW BRIDGE, with seq
	for (let row = 0; row < bridgeLength; row++) {
		let rowArray = [];
		for (let tile = 0; tile < bridgeWidth; tile++) {
			if (tile + 1 === crossSequence[row]) rowArray[tile] = `${chalk.red('*')}`;
			else {
				rowArray[tile] = '*';
			}
			// console.log(rowArray);
		}
		console.log(rowArray.join(' '));
		//PLAY TILE SOUND HERE
	}
	readlineSync.question('Memorize this sequence. Press enter to clear.');

	// DRAW BRIDGE, no seq
	for (let row = 0; row < bridgeLength; row++) {
		let rowArray = [];
		for (let tile = 0; tile < bridgeWidth; tile++) rowArray[tile] = '*';
		console.log(rowArray.join(' '));
	}

	playerMoves();
}

function playerMoves() {
	// input from player, row by row
	// if tile player moves to matches sequence, successful move
	// if all rows crossed, round over, player succeeds
	readlineSync.question('Press enter to WIN THE ROUND.');
	playerWins = true;
	endOfRound();
}

function endOfRound() {
	// deteremine win or loss and do things
	if (playerWins) newRound();
}

welcome();
newRound();
