import readlineSync from 'readline-sync';
import Afplay from 'afplay';
import chalk from 'chalk';
import termkit from 'terminal-kit';

const term = termkit.terminal;

let player = new Afplay();

const bridgeWidth = 4;
const crossSequence = [];
let bridgeLength = 1;
let playerWins = true;
let round = 1;
let hiScore = { name: 'YOU', score: 1 };

/*

For SERVER:
- generate sequence function
- store high score and show on welcome


*/

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
	console.clear();

	await drawSeqBridge();

	console.log(`
The green tiles ${chalk.green('*')} are safe. 
All other tiles * will break if you step on them. 

You have only a few seconds to memorize this sequence! 

`);

	await waitEnter(5000 - round * 375);
	await drawBridge();
	await playerMoves();
}

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

		player.play(`./${crossSequence[row]}.mp3`, { volume: 1 });

		await wait(950 - round * 50);
	}
};

const drawBridge = async () => {
	console.clear();
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
	let tilePosition = 1;
	let rowPosition = -1;

	const MAX = bridgeWidth;
	const MIN = 0;
	let key;

	//MOVE CURSOR TO TOP
	term.up(bridgeLength + 1);
	term.right(4);

	while (true) {
		key = readlineSync.keyIn('', { hideEchoBack: true, mask: '', limit: 'azxcd ' });
		if (key === 'a') {
			if (tilePosition > MIN) {
				tilePosition--;
				term.left(2);
			}
		} else if (key === 'd') {
			if (tilePosition < MAX) {
				tilePosition++;
				term.right(2);
			}
		} else if (key === 'x') {
			term.down(1);
			rowPosition++;
		} else if (key === 'z') {
			if (tilePosition > MIN) {
				tilePosition--;
				term.down(1);
				term.left(2);
				rowPosition++;
			}
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

		if (rowPosition >= bridgeLength) {
			term.nextLine(1);
			term.green('ROUND COMPLETED!');
			break;
		}

		if (tilePosition === crossSequence[rowPosition]) {
			process.stdout.write(`${chalk.green('*')}`);
			term.left(1); // move back after printing green star
			player.play(`./${crossSequence[rowPosition]}.mp3`, { volume: 1 });
		} else if (rowPosition >= 0) {
			player.play(`./fall.mp3`, { volume: 1 });
			console.log('O');
			term.nextLine(bridgeLength - rowPosition);
			console.log(`${chalk.red('YOU STEPPED ON THE WRONG TILE!')}`);
			if (round > hiScore.score) {
				hiScore.name = readlineSync.question('YOU GOT A HI SCORE! Enter your name:');
				hiScore.score = round;
			}
			readlineSync.question('Press enter to start a new game.');
			playerWins = false;
			break;
		}
	}

	// readlineSync.question('Press enter to WIN THE ROUND.');
	// playerWins = true;
	endOfRound();
}

function endOfRound() {
	// deteremine win or loss and do things
	term.nextLine(1);
	readlineSync.question('Press enter to continue.');
	if (playerWins) {
		round++;
		newRound();
	} else {
		welcome();
		newRound();
	}
}

const wait = async (ms) => {
	return new Promise((resolve) => {
		setTimeout(() => {
			resolve();
		}, ms);
	});
};

const waitEnter = async (ms) => {
	return new Promise((resolve) => {
		setTimeout(() => {
			resolve(console.clear());
		}, ms);
	});
};

welcome();
newRound();
