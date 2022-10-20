import readlineSync from 'readline-sync';
// import Afplay from 'afplay';
import chalk from 'chalk';
import termkit from 'terminal-kit';
import sound from 'sound-play';
import fetch from 'node-fetch';

const term = termkit.terminal;

// let player = new Afplay();

const bridgeWidth = 4;
let crossSequence;
let bridgeLength = 1;
let playerWins = true;
let round = 1;
let hiScore = { name: 'YOU', score: 1 };

/*

For SERVER:
- generate sequence function
- store high score and show on welcome
-  CONST B & Y for 

*/

// WELCOME SCREEN
function welcome() {
	bridgeLength = 1;
	round = 1;
	playerWins = true;
	console.clear();
	console.log(`
    
    
        ${chalk.yellowBright('𓀠')}
  ${chalk.blue('~~')}| * * * * |${chalk.blue('~~')}
  ${chalk.blue('~~')}| * * * * |${chalk.blue('~~')}
  ${chalk.blue('~~')}| * * * * |${chalk.blue('~~')}
  ${chalk.blue('~~')}| ${chalk.yellowBright('Welcome')} |${chalk.blue('~~')}
  ${chalk.blue('~~')}|   ${chalk.yellowBright('to')}    |${chalk.blue('~~')}
  ${chalk.blue('~~')}| ${chalk.yellowBright('BRIDGE')}  |${chalk.blue('~~')}
  ${chalk.blue('~~')}| ${chalk.yellowBright('CROSSER')} |${chalk.blue('~~')} 
  ${chalk.blue('~~')}| * * * * |${chalk.blue('~~')}
  ${chalk.blue('~~')}| * * * * |${chalk.blue('~~')}
  ${chalk.blue('~~')}| * * * * |${chalk.blue('~~')}
        
${chalk.green(` A BRIDGE-CROSSING 
   SURVIVAL GAME!`)}

  ${chalk.yellowBright(`HI SCORE: ${hiScore.name} ${hiScore.score} `)}

    `);
	readlineSync.question('Press enter to continue.');
}

async function newRound() {
	bridgeLength++;

	// GENERATE SEQUENCE via SERVER
	const response = await fetch(`http://localhost:4000/bridgeSequence?length=${bridgeLength}&width=${bridgeWidth}`);
	crossSequence = await response.json();

	console.clear();

	await drawSeqBridge();

	console.log(`
The green tiles ${chalk.green('*')} are safe. 
All other tiles * will break if you step on them. 

You have only a few seconds to memorize this sequence! 

`);

	await waitMemorize(5000 - round * 275);
	await drawBridge();
	await playerMoves();
}

// draws bridge with sequence reveal
const drawSeqBridge = async () => {
	term.green(`Round ${round}
    `);
	console.log();
	for (let row = 0; row < bridgeLength; row++) {
		let rowArray = [`${chalk.blue('~~')}|`, '', '', '', '', `|${chalk.blue('~~')}`];
		for (let tile = 0 + 1; tile < bridgeWidth + 1; tile++) {
			if (tile === crossSequence[row]) rowArray[tile] = `${chalk.green('*')}`;
			else {
				rowArray[tile] = '*';
			}
			// console.log(rowArray);
		}
		console.log(rowArray.join(' '));

		// SOUND - filename corresponds to tile
		sound.play(`../audio/${crossSequence[row]}.mp3`, { volume: 1 });

		// memorization time: progressively shorter / harder
		await wait(950 - round * 50);
	}
};

// draws bridge (no reveal)
const drawBridge = async () => {
	console.clear();
	//INSTRUCTIONS
	console.log(`Move player down, across the bridge.`);
	term.yellow(`

    Use these keys:

      ← A     D ➡️
        Z  X  C
       ↙️   ↓   ↘️
`);
	console.log(`
    

Avoid stepping on the tiles that will break, 
or you will fall into the river.
 
    `);
	console.log();
	for (let row = 0; row < bridgeLength; row++) {
		let rowArray = [`${chalk.blue('~~')}|`, '', '', '', '', `|${chalk.blue('~~')}`];
		for (let tile = 0 + 1; tile < bridgeWidth + 1; tile++) rowArray[tile] = '*';
		console.log(rowArray.join(' '));
		await wait(200);
	}
};

function playerMoves() {
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
		key = readlineSync.keyIn('', { hideEchoBack: true, mask: '', limit: 'azxcd ' });
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
			}
			readlineSync.question('Press enter to start a new game.');
			playerWins = false;
			break;
		}
	}

	endOfRound();
}

function endOfRound() {
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

// WAIT function programmed delays
const wait = async (ms) => {
	return new Promise((resolve) => {
		setTimeout(() => {
			resolve();
		}, ms);
	});
};

// WAIT for memorization / reveal
const waitMemorize = async (ms) => {
	return new Promise((resolve) => {
		setTimeout(() => {
			resolve(console.clear());
		}, ms);
	});
};

welcome();
newRound();
