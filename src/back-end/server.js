import express from 'express';
import { bridgeSequence } from './routes/bridge-crossers.js';
import { getHiScore } from './routes/bridge-crossers.js';
import { newHiScore } from './routes/bridge-crossers.js';

////////////////////
//
//  SERVER SETUP
//
////////////////////
const app = express();
const PORT = 4000;

app.listen(PORT, () => {
	console.log(`Bridge Crosser server is listening on port ${PORT}.`);
});

// for method responses
app.use(express.json());

// routes
app.use('/bridgeSequence', bridgeSequence);
app.use('/getHiScore', getHiScore);
app.use('/newHiScore', newHiScore);
