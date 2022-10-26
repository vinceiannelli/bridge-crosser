import readlineSync from 'readline-sync';
import chalk from 'chalk';
import termkit from 'terminal-kit';
import sound from 'sound-play';
import fetch from 'node-fetch';

const term = termkit.terminal;

const bridgeWidth = 4;
const DIFFICULTY_MULTIPLIER = 315; // adds progressive challenge as you reach higher levels
const BASE_MEMORIZATION_TIME = 5000;

let crossSequence; // the randomized sequence
let bridgeLength = 1;
let playerWins = true;
let round = 1;
let hiScore = { name: 'YOU', score: 1 };

// consts for colors
const y = chalk.yellow;
const yb = chalk.yellowBright;
const b = chalk.blue;

/*

TO DO:
- (randomized) footsteps
- disconnect db connection (how and when?)

*/

//////
// WAIT function programmed delays
//////
const wait = async (ms) => {
	return new Promise((resolve) => {
		setTimeout(() => {
			resolve();
		}, ms);
	});
};

//////
// WAIT for memorization / reveal
//////
const waitMemorize = async (ms) => {
	return new Promise((resolve) => {
		setTimeout(() => {
			resolve(console.clear());
		}, ms);
	});
};

//////
// GETS HI SCORE from server / db
//////
async function getHiScore() {
	const response = await fetch(`http://localhost:4000/getHiScore`);
	hiScore = await response.json();
	// await wait(1200);
}

////////////////////
//
//  WELCOME - intro and welcome
//
////////////////////
function welcome() {
	// resets values for new game
	bridgeLength = 1;
	round = 1;
	playerWins = true;

	process.stdin.setRawMode(true); // prevents user key input from printing
	console.clear();

	//SOUNDS
	sound.play(`../audio/mountain-stream.mp3`, { volume: 1 });
	sound.play(`../audio/hit-welcome.mp3`, { volume: 1 });
	console.log(`
    
    
        ${yb('𓀠')}
  ${b('~~')}| * * * * |${b('~~')}
  ${b('~~')}| * * * * |${b('~~')}
  ${b('~~')}| * * * * |${b('~~')}
  ${b('~~')}| ${yb('Welcome')} |${b('~~')}
  ${b('~~')}|   ${yb('to')}    |${b('~~')}
  ${b('~~')}| ${yb('BRIDGE')}  |${b('~~')}
  ${b('~~')}| ${yb('CROSSER')} |${b('~~')} 
  ${b('~~')}| * * * * |${b('~~')}
  ${b('~~')}| * * * * |${b('~~')}
  ${b('~~')}| * * * * |${b('~~')}
        
${chalk.green(` A BRIDGE-CROSSING 
   SURVIVAL GAME!`)}

  ${yb(`HI SCORE: ${hiScore.name} ${hiScore.score} `)}

    `);
	readlineSync.question('Press enter to continue...');
	console.clear();
	console.log(` In ${y('BRIDGE CROSSER')},
your goal is to move 
 your player safely
 across the bridge.
	
  Move your player 
  using these keys:

   ← ${y('[')}A${y(']')}   ${y('[')}D${y(']')} →
     ${y('[')}Z${y(']')}${y('[')}X${y(']')}${y('[')}C${y(']')}
    ↙    ↓    ↘
`);
	console.log(`
Avoid stepping on the 
tiles that will break, 
  or you will fall 
   into the river.
 
    `);

	process.stdin.setRawMode(false); // allows user input again

	readlineSync.question('Press enter to continue...');
}

////////////////////
//
// NEW ROUND - executed for each round
//
////////////////////
async function newRound() {
	bridgeLength++;

	// GENERATE SEQUENCE via SERVER
	const response = await fetch(`http://localhost:4000/bridgeSequence?length=${bridgeLength}&width=${bridgeWidth}`);
	crossSequence = await response.json();

	console.clear();

	await drawSeqBridge();
	// show this message until round 4
	if (round <= 4)
		console.log(`
The green tiles 
       ${chalk.green('*')} 
   are safe. 

The rest * will
 break if you 
 step on them. 

You have only a 
few seconds to `);
	console.log(`
${chalk.green(`   MEMORIZE 
THIS SEQUENCE`)}! 

`);
	// progressive difficulty as player reaches higher levels
	await waitMemorize(BASE_MEMORIZATION_TIME - round * DIFFICULTY_MULTIPLIER);
	await drawBridge();
	await playerMoves();
}

////////////////////
//
// DRAW SEQUENCE BRIDGE - draws bridge step by step while revealing cross sequence
//
////////////////////
const drawSeqBridge = async () => {
	process.stdin.setRawMode(true);

	term.green(`Round ${round}
    `);
	console.log();
	for (let row = 0; row < bridgeLength; row++) {
		let rowArray = [`${b('~~')}|`, '', '', '', '', `|${b('~~')}`];
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

	process.stdin.setRawMode(false);
};

////////////////////
//
// DRAW BRIDGE - draws bridge step by step with no sequence
//
////////////////////
const drawBridge = async () => {
	console.clear();

	process.stdin.setRawMode(true);

	//INSTRUCTIONS
	console.log(`Move player down, 
across the bridge.`);
	term.white(`

  Use these keys
   to move your
     player:

  ← ${y('[')}A${y(']')}   ${y('[')}D${y(']')} →
    ${y('[')}Z${y(']')}${y('[')}X${y(']')}${y('[')}C${y(']')}
   ↙    ↓    ↘
`);
	console.log(`
    
Avoid stepping on 
 the tiles that 
  will break or
  you will fall 
 into the river.
	 
    `);
	console.log();
	for (let row = 0; row < bridgeLength; row++) {
		let rowArray = [`${b('~~')}|`, '', '', '', '', `|${b('~~')}`];
		for (let tile = 0 + 1; tile < bridgeWidth + 1; tile++) rowArray[tile] = '*';
		console.log(rowArray.join(' '));
		await wait(200);
	}
	///
	process.stdin.setRawMode(false);
	///
};

////////////////////
//
// PLAYER MOVES - handles player movement inputs and processes tile success and failure
//
////////////////////
async function playerMoves() {
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
			sound.play(`../audio/hit-win.mp3`, { volume: 1 });
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

////////////////////
//
// END OF ROUND - determine win or loss
//
////////////////////
function endOfRound() {
	term.nextLine(1);
	// Player wins round
	if (playerWins) {
		round++;
		newRound();
	} else {
		// Player loses round and starts over
		welcome();
		newRound();
	}
}

// get Hi Score from server / db
await getHiScore();
welcome();
newRound();
