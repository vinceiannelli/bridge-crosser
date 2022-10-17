const readlineSync = require('readline-sync');
const Afplay = require('afplay');

let player = new Afplay();

function welcome() {
	console.log(`
    
    
    
      **** WELCOME TO BRIDGE CROSSER ****
      
      
      
      
    `);
	newGame();
	readlineSync.question('Press enter to continue.');
}

function newGame() {
	// console.clear();
	generateSeqElement();
}

let bridgeWidth = 4;
let bridgeArray = [];
let noOfRows = 0;
let crossSequence = [];

function createBridgeRow() {
	bridgeArray[noOfRows] = [];
	for (let i = 0; i < bridgeWidth; i++) {
		bridgeArray[noOfRows][i] = '*';
	}
}

function drawBridge() {
	for (let i = 0; i < bridgeArray.length; i++) {
		console.log(bridgeArray[i].join(''));
	}
}

function newRound() {
	console.clear();
	readlineSync.question('Press enter to start a new round.');
	noOfRows++;
	drawBridge();
	playSequence();
	generateSeqElement();
	readlineSync.question('ROUND OVER. Press enter to start a new round.');
}

function generateSeqElement() {
	crossSequence[noOfRows] = Math.floor(Math.random() * 4);
	console.log(crossSequence);
}

function playSequence() {
	for (let index in crossSequence) player.play(`./${crossSequence[index] + 1}.mp3`, { volume: 1 });
}

welcome();
createBridgeRow();
newRound();
createBridgeRow();
newRound();
createBridgeRow();
newRound();
