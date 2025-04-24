import { Board } from "./board.js";

const cardsCont = document.getElementById('cards-cont');
const board = new Board(cardsCont);

console.log(board);
// window.addEventListener('click', () => {
// 	board.clearCards().then(res => console.log(res)).catch(error => console.error(error));
// });

async function loadCardTextures () {
	const suits = ['c', 'd', 'h', 's'];
	const cardTextures = new Map();

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

	return cardTextures;
}

function loadVillageTalk () {
	return new Promise(async (resolve, reject) => {
		try {
			const response = await fetch('res/data/ombi-village-talk.json');

			if (!response.ok) throw new Error('Failed to fetch');

			const messages = await response.json();

			resolve(messages);
		} catch (error) {
			reject(`ombi-village-talk.json: ${error}`);
		}
	});
}

function initEvents () {
	cardsCont.addEventListener('click', event => {
		board.onclick(event);
	});
}

async function init () {
	try {
		board.textures = await loadCardTextures();
		board.villageTalkMessages = await loadVillageTalk();

		board.setPack(JSON.stringify(Board.getRandomPacks(board)));
		initEvents();
	} catch (error) {
		console.error(error);
	}
}

init();
