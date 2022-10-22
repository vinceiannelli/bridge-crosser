import chalk from 'chalk';
import fetch from 'node-fetch';
import { playerMoves } from './playerMoves';
import { drawSeqBridge, drawBridge } from './drawBridge';
import {
	bridgeLength,
	bridgeWidth,
	crossSequence,
	waitMemorize,
	BASE_MEMORIZATION_TIME,
	round,
	DIFFICULTY_MULTIPLIER,
} from './index';

export async function newRound() {
	bridgeLength++;

	// GENERATE SEQUENCE via SERVER
	const response = await fetch(`http://localhost:4000/bridgeSequence?length=${bridgeLength}&width=${bridgeWidth}`);
	crossSequence = await response.json();

	console.clear();

	await drawSeqBridge();

	console.log(`
The green tiles 
       ${chalk.green('*')} 
   are safe. 

The rest * will
 break if you 
 step on them. 

You have only a 
few seconds to 
${chalk.green(`   MEMORIZE 
THIS SEQUENCE`)}! 

`);

	await waitMemorize(BASE_MEMORIZATION_TIME - round * DIFFICULTY_MULTIPLIER);
	await drawBridge();
	await playerMoves();
}
