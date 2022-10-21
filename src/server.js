import mongoose from 'mongoose';
import express from 'express';
import { bridgeSequence } from './routes/bridge-crossers.js';
import { getHiScore } from './routes/bridge-crossers.js';
import { newHiScore } from './routes/bridge-crossers.js';

const app = express();
const PORT = 4000;
// let hiScore = { name: 'YOU', score: 1 };

app.use(express.json());

app.listen(PORT, () => {
	console.log(`Bridge Crosser server is listening on port ${PORT}.`);
});

app.use('/bridgeSequence', bridgeSequence);
app.use('/getHiScore', getHiScore);
app.use('/newHiScore', newHiScore);

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
export const HiScore = model('HiScore', hiScoreSchema);

// get hi score from db
export const bcScore = await HiScore.findOne();
