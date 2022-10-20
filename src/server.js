import mongoose from 'mongoose';
import express from 'express';

const app = express();
const PORT = 4000;

app.use(express.json());

app.listen(PORT, () => {
	console.log(`Bridge Crosser server is listening on port ${PORT}.`);
});

app.get('/bridgeSequence', (request, response) => {
	let length = request.query.length;
	let width = request.query.width;

	let jsonSequence = generateTileSequence(length, width);

	response.json(jsonSequence);
});

//
//
//
//
//
// DB PLAY
//
// connect to db
await mongoose
	.connect('mongodb+srv://viannelli:n8dIp6pXhvrYLz9z@cluster0.wmpww0r.mongodb.net/?retryWrites=true&w=majority')
	.then(() => console.log('database connected'));

const { Schema, model } = mongoose;

const hiScoreSchema = new Schema({
	playerName: String,
	playerScore: Number,
});

const HiScore = model('HiScore', hiScoreSchema);

// // Create a new blog post object
// const bcScore = new HiScore({
// 	playerName: 'newPlayer',
// 	playerScore: 2,
// });

// // Insert the article in our MongoDB database
// await bcScore.save();

//FIND in db
const dbScore = await HiScore.findById('63514c4ed1610d8db87dfd4c').exec();

let bcHiScore = dbScore.playerScore;
let bcHiScorePlayer = dbScore.playerName;

console.log(bcHiScorePlayer, bcHiScore);
//
//
//
//
//

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

// let jsonSequence = JSON.stringify(generateTileSequence(4, 4));

// console.log(jsonSequence);
