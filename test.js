import readline from 'readline-sync';

readline.keyIn('Do you want to go left (L) or right (R)?', { hideEchoBack: true, mask: '', limit: 'lr' });
