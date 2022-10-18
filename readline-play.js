import readlineSync from 'readline-sync';
import termkit from 'terminal-kit';

const term = termkit.terminal;

const MAX = 3;
const MIN = 0;
let position = 1;
let key;
console.log('\n\n' + new Array(20).join(' ') + '[Z] <- -> [X]  FIX: [SPACE]\n');
while (true) {
	// console.log(
	// 	'\x1B[1A\x1B[K|' +
	// 		new Array(position + 1).join('-') +
	// 		'O' +
	// 		new Array(MAX - position + 1).join('-') +
	// 		'| ' +
	// 		position
	// );
	key = readlineSync.keyIn('', { hideEchoBack: true, mask: '', limit: 'aqwed ' });
	if (key === 'a') {
		if (position > MIN) {
			position--;
		}
	} else if (key === 'd') {
		if (position < MAX) {
			position++;
		}
	} else if (key === 'w') {
		term.up(1);
	} else if (key === 'q') {
		term.up(1);
		term.left(1);
		if (position > MIN) {
			position--;
		}
	} else if (key === 'e') {
		if (position < MAX) {
			position++;
		}
		term.up(1);
		term.right(1);
	} else {
		break;
	}
}
console.log('\nA value the user requested: ' + position);
