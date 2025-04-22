import { Board } from "./board.js";

const board = new Board(document.getElementById('cards-cont'));
const cardTextures = [];

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

	for (const suit of suits)
		for (let a = 1; a < 14; a++)
			cardTextures.push(await loadTexture(`${suit}${(a + 1).toString().padStart(2, '0')}`));
}

async function init () {
	try {
		await loadCardTextures();
		board.setupCards();
		board.setTextures(cardTextures);
		
		console.log(Board.getRandomPacks(board));
	} catch (error) {
		console.error(error);
	}
}

init();
