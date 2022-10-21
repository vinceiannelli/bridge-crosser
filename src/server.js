import mongoose from 'mongoose';
import express from 'express';

const app = express();
const PORT = 4000;
// let hiScore = { name: 'YOU', score: 1 };

app.use(express.json());

app.listen(PORT, () => {
	console.log(`Bridge Crosser server is listening on port ${PORT}.`);
});

// connect to db
await mongoose
	.connect('mongodb+srv://viannelli:n8dIp6pXhvrYLz9z@cluster0.wmpww0r.mongodb.net/?retryWrites=true&w=majority')
	.then(() => console.log('database connected'));

const { Schema, model } = mongoose;

// db schema
const hiScoreSchema = new Schema({
	playerName: String,
	playerScore: Number,
});

// db model / doc
const HiScore = model('HiScore', hiScoreSchema);

// get hi score from db
const bcScore = await HiScore.findOne();

// ENDPOINT: generate random sequence
app.get('/bridgeSequence', (request, response) => {
	let length = request.query.length;
	let width = request.query.width;

	let jsonSequence = generateTileSequence(length, width);

	response.json(jsonSequence);
});

/// ENDPOINT: get hi score
app.get('/getHiScore', async (request, response) => {
	let dbScore = await getHiScoreDB();
	console.log(dbScore);
	let bcHiScore = dbScore.playerScore;
	let bcHiScorePlayer = dbScore.playerName;

	let dbHiScore = { name: bcHiScorePlayer, score: bcHiScore };

	response.json(dbHiScore);
});

// ENDPOINT: update hi score on server
app.get('/newHiScore', async (request, response) => {
	let playerScore = request.query.score;
	let playerName = request.query.player;
	// let dbScore = {};
	bcScore.playerScore = playerScore;
	bcScore.playerName = playerName;
	await bcScore.save();
	console.log(bcScore);

	response.json(bcScore);
});

async function getHiScoreDB() {
	const score = await HiScore.findOne();
	bcScore.playerScore = score.playerScore;
	bcScore.playerName = score.playerName;
	return bcScore;
}

function generateTileSequence(bridgeLength, bridgeWidth) {
	const crossSequence = [];
	for (let row = 0; row < bridgeLength; row++) {
		if (row === 0) {
			crossSequence[row] = Math.floor(Math.random() * bridgeWidth + 1);
		} else {
			crossSequence[row] = Math.floor(Math.random() * bridgeWidth + 1);
			// ensure next row is within one tile
			while (
				crossSequence[row] >= crossSequence[row - 1] + 2 ||
				crossSequence[row] <= crossSequence[row - 1] - 2
			) {
				crossSequence[row] = Math.floor(Math.random() * bridgeWidth + 1);
			}
		}
	}
	return crossSequence;
}
