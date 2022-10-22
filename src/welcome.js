import readlineSync from 'readline-sync';
import chalk from 'chalk';
import { bridgeLength, round, playerWins, hiScore, w } from './index';

// WELCOME SCREEN
export function welcome() {
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
	readlineSync.question('Press enter to continue...');
	console.clear();
	console.log(` In ${w('BRIDGE CROSSER')},
your goal is to move 
 your player safely
 across the bridge.
	
  Move your player 
  using these keys:

   ← ${w('[')}A${w(']')}   ${w('[')}D${w(']')} →
     ${w('[')}Z${w(']')}${w('[')}X${w(']')}${w('[')}C${w(']')}
    ↙    ↓    ↘
`);
	console.log(`
Avoid stepping on the 
tiles that will break, 
  or you will fall 
   into the river.
 
    `);
	readlineSync.question('Press enter to continue...');
}
