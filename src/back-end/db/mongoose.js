import mongoose from 'mongoose';

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

// mongoose.disconnect();
