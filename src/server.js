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
