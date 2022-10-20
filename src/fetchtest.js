import fetch from 'node-fetch';
let crossSequence;

// GENERATE SEQUENCE via SERVER
const response = await fetch('http://localhost:4000/bridgeSequence?length=4&width=4');
crossSequence = await response.json();
console.log(crossSequence);
