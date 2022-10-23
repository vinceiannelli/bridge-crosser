import express from 'express';
import { bridgeSequence } from './routes/bridge-crossers.js';
import { getHiScore } from './routes/bridge-crossers.js';
import { newHiScore } from './routes/bridge-crossers.js';

const app = express();
const PORT = 4000;

app.use(express.json());

app.listen(PORT, () => {
	console.log(`Bridge Crosser server is listening on port ${PORT}.`);
});

app.use('/bridgeSequence', bridgeSequence);
app.use('/getHiScore', getHiScore);
app.use('/newHiScore', newHiScore);
