class Card {
	constructor (suit, value, dom = null) {
		this.suit = suit;
		this.value = value;
		this.dom = dom;
	}

	toString () {
		return `${this.suit}-${this.value.toString().padStart(2, '0')}`;
	}
}

class Board {
	constructor (cardsCont, throwArea) {
		this.cardsCont = cardsCont;
		this.throwArea = throwArea;
		this.textures = [];
		this.pack = [];
		this.playerPacks = Array.from({ length: 4 }, () => new Array());
		this.trumpSuit = 'c'; // c ♣ | d ♦ | h ♥ | s ♠
		this.leadSuit = 'c'; // c ♣ | d ♦ | h ♥ | s ♠
		this.penaltyRedCards = [];
		this.penaltyBlackCards = [];
		this.cardOnBoard = [];
		this.roundIndex = 0;
		this.cardHideTranslateY = 300;
		this.cardHideTimeout = 500;
		this.villageTalkMessages = null;
		this.manager = null;
	}

	initPack () {
		this.pack.length = 0;
		this.penaltyRedCards.length = 0;
		this.penaltyBlackCards.length = 0;

		const suits = ['c', 'd', 'h', 's'];

		suits.forEach(suit => {
			for (let a = 7; a <= 14; a++) {
				const card = new Card(suit, a);
				const cardDOM = document.createElement('div');
				const img = this.textures.get(card.toString().replace('-', ''));

				card.dom = cardDOM;

				cardDOM.classList.add('card');
				cardDOM.appendChild(img);

				this.pack.push(card);
			}

			for (let a = 2; a <= 6; a++)
				(suit === 'c' || suit === 's' ? this.penaltyBlackCards : this.penaltyRedCards).push(new Card(suit, a));
		});
	}

	async setPack (jsonData) {
		try {
			const data = JSON.parse(jsonData);
			const packMap = new Map();

			this.pack.forEach(card => packMap.set(card.toString(), card));

			for (let a = 0; a < 4; a++)
				for (let b = 0; b < 8; b++)
					this.playerPacks[a].push(packMap.get(data[a][b]));
		} catch (error) {
			console.error(error);
		}
	}

	dropCard (card, playerPack, hand) {
		const dom = card.dom;
		const handClass = hand == 0 ?
			'bottom' :
				hand == 1 ?
					'right' :
					hand == 2 ?
						'top' : 'left';

		dom.classList.add(handClass);
		dom.style.removeProperty('transform');
		this.throwArea.appendChild(dom);

		this.cardOnBoard.push(...playerPack.splice(playerPack.findIndex(testCard => testCard === card), 1));

		if (this.roundIndex === 0) this.leadSuit = card.suit;
		
		this.roundIndex = (this.roundIndex + 1) % 4;

		if (this.manager) this.manager.dropCard(hand);
	}

	alert (message, type = 'warning') {
		window.alert(`${type.toLocaleUpperCase()}: ${this.villageTalkMessages[message]}`);
	}

	static getRandomPacks (board) {
		const pack = board.pack.map(card => card);

		const packs = Array.from({ length: 4 }, () => new Array());

		for (let a = 7; a < 15; a++) {
			packs[0].push(pack.splice(Math.floor(Math.random() * pack.length), 1)[0].toString());
			packs[1].push(pack.splice(Math.floor(Math.random() * pack.length), 1)[0].toString());
			packs[2].push(pack.splice(Math.floor(Math.random() * pack.length), 1)[0].toString());
			packs[3].push(pack.splice(Math.floor(Math.random() * pack.length), 1)[0].toString());
		}

		return packs;
	}
}

export {
	Card,
	Board
};
