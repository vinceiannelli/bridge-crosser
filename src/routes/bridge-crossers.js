import express from 'express';

import { getHiScoreDB, generateTileSequence } from '../models/bridge-crosser.js';

import { bcScore } from '../server.js';

const app = express();
export const bridgeSequence = express.Router();
export const getHiScore = express.Router();
export const newHiScore = express.Router();

// ENDPOINT: generate random sequence
bridgeSequence.get('/', (request, response) => {
	let length = request.query.length;
	let width = request.query.width;

	let jsonSequence = generateTileSequence(length, width);

	response.json(jsonSequence);
});

/// ENDPOINT: get hi score
getHiScore.get('/', async (request, response) => {
	let dbScore = await getHiScoreDB();
	console.log(dbScore);
	let bcHiScore = dbScore.playerScore;
	let bcHiScorePlayer = dbScore.playerName;

	let dbHiScore = { name: bcHiScorePlayer, score: bcHiScore };

	response.json(dbHiScore);
});

// ENDPOINT: update hi score on server
newHiScore.get('/', async (request, response) => {
	let playerScore = request.query.score;
	let playerName = request.query.player;
	// let dbScore = {};
	bcScore.playerScore = playerScore;
	bcScore.playerName = playerName;
	await bcScore.save();
	console.log(bcScore);

	response.json(bcScore);
});
