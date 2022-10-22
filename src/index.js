import chalk from 'chalk';
import termkit from 'terminal-kit';
import fetch from 'node-fetch';
import { welcome } from './welcome';
import { newRound } from './newRound';

export const term = termkit.terminal;

export const bridgeWidth = 4;
export const DIFFICULTY_MULTIPLIER = 315;
export const BASE_MEMORIZATION_TIME = 5000;
export let crossSequence;
export let bridgeLength = 1;
export let playerWins = true;
export let round = 1;
export let hiScore = { name: 'YOU', score: 1 };
export const w = chalk.yellow;

/*

TO DO:

- break for waits

*/

// WAIT function programmed delays
export const wait = async (ms) => {
	return new Promise((resolve) => {
		setTimeout(() => {
			resolve();
		}, ms);
	});
};

// WAIT for memorization / reveal
export const waitMemorize = async (ms) => {
	return new Promise((resolve) => {
		setTimeout(() => {
			resolve(console.clear());
		}, ms);
	});
};

async function getHiScore() {
	const response = await fetch(`http://localhost:4000/getHiScore`);
	hiScore = await response.json();
	// await wait(1200);
}

await getHiScore();
welcome();
newRound();
