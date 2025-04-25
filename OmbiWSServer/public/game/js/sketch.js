import { Board } from "./board.js";
import OmbiGameManager from "./ombi-game-manager.js";

const cardsCont = document.getElementById('cards-cont');
const throwArea = document.getElementById('throw-area');
const board = new Board(cardsCont, throwArea);
const gameManager = new OmbiGameManager(board);

console.log(gameManager);

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

async function init () {
	try {
		board.textures = await loadCardTextures();
		board.villageTalkMessages = await loadVillageTalk();

		board.initPack();
		gameManager.setPack(JSON.stringify(Board.getRandomPacks(board)));
	} catch (error) {
		console.error(error);
	}
}

init();
