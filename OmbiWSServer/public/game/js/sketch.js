import { Board } from "./board.js";

const board = new Board(document.getElementById('cards-cont'));
const cardTextures = new Map();

console.log(board);
// window.addEventListener('click', () => {
// 	board.clearCards().then(res => console.log(res)).catch(error => console.error(error));
// });

async function loadCardTextures () {
	const suits = ['c', 'd', 'h', 's'];

	const loadTexture = (url) => new Promise((resolve, reject) => {
		const img = new Image();

		img.src = `res/img/cards/${url}.png`;

		img.addEventListener('load', () => {
			resolve(img);
		});
		img.addEventListener('error', reject);
	});

	for (const suit of suits) {
		for (let a = 1; a < 14; a++) {
			const url = `${suit}${(a + 1).toString().padStart(2, '0')}`;
			cardTextures.set(url, await loadTexture(url));
		}
	}
}

async function init () {
	try {
		await loadCardTextures();
		board.setTextures(cardTextures);
		board.setPack(JSON.stringify(Board.getRandomPacks(board)));
	} catch (error) {
		console.error(error);
	}
}

init();
