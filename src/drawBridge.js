import chalk from 'chalk';
import sound from 'sound-play';
import { term, round, bridgeLength, bridgeWidth, crossSequence, wait, w } from './index.js';

// draws bridge with sequence reveal
export const drawSeqBridge = async () => {
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
export const drawBridge = async () => {
	console.clear();
	//INSTRUCTIONS
	console.log(`Move player down, 
across the bridge.`);
	term.white(`

 Use these keys
  to move your
    player:

  ← ${w('[')}A${w(']')}   ${w('[')}D${w(']')} →
    ${w('[')}Z${w(']')}${w('[')}X${w(']')}${w('[')}C${w(']')}
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
		let rowArray = [`${chalk.blue('~~')}|`, '', '', '', '', `|${chalk.blue('~~')}`];
		for (let tile = 0 + 1; tile < bridgeWidth + 1; tile++) rowArray[tile] = '*';
		console.log(rowArray.join(' '));
		await wait(200);
	}
};
