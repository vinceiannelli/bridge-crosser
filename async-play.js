const asyncLoop = async () => {
	for (let i = 0; i < 10; i++) {
		console.log(i);
		await wait(100);
	}
};

const asyncLoop2 = async () => {
	for (let i = 54; i > 10; i--) {
		console.log(i);
		await wait(10);
	}
};

const wait = async (ms) => {
	return new Promise((resolve) => {
		setTimeout(() => {
			resolve();
		}, ms);
	});
};

async function playLoops() {
	await asyncLoop();
	await asyncLoop2();
}

playLoops();
