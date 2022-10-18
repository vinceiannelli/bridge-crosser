import readlineSync from 'readline-sync';
import Afplay from 'afplay';
import chalk from 'chalk';

let player = new Afplay();

async function welcome() {
	console.log(`
    
    
    
      **** WELCOME TO BRIDGE CROSSER ****
      
      
      
      
    `);
	await wait(2000);
	newGame();
	readlineSync.question('Press enter to continue. WELCOME');
}

function newGame() {
	// console.clear();
	generateSeqElement();
}

let bridgeWidth = 4;
let bridgeArray = [];
let noOfRows = 0;
let crossSequence = [];
let playerRow = 0;

const createBridgeRow = async () => {
	bridgeArray[noOfRows] = [];
	for (let i = 0; i < bridgeWidth; i++) {
		bridgeArray[noOfRows][i] = '*';
		await wait(1000);
	}
};

//
// ASYNC STUFF
//   |
//   V
//

const drawBridge = async (row, col) => {
	for (let i = 0; i < bridgeArray.length; i++) {
		if (row === i) {
			let tempArr = bridgeArray[i];
			tempArr[col] = `${chalk.red('*')}`;
			console.log(tempArr.join(''));
			player.play(`./${col + 1}.mp3`, { volume: 1 });
		} else console.log(bridgeArray[i].join(''));
		await wait(1000);
		// playSequence();
	}
};

const wait = async (ms) => {
	return new Promise((resolve) => {
		setTimeout(() => {
			resolve();
		}, ms);
	});
};

//
//   ^
//   |
//

const newRound = async () => {
	console.clear();
	readlineSync.question('Press enter to start a new round.');
	noOfRows++;
	drawBridge(playerRow, crossSequence[playerRow]);
	generateSeqElement();
	await wait(1000);
	readlineSync.question('ROUND OVER. Press enter to start a new round.');
};

function generateSeqElement() {
	crossSequence[noOfRows] = Math.floor(Math.random() * 4);
	console.log(crossSequence);
}

// function playSequence() {
// 	for (let index in crossSequence) {
// 		readlineSync.question('PLAY A NOTE: Press enter.');
// 		player.play(`./${crossSequence[index] + 1}.mp3`, { volume: 1 });
// 	}
// }

async function runGame() {
	welcome();
	await wait(2000);
	createBridgeRow();
	await wait(2000);
	newRound();
}

runGame();
