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
	constructor (cardsCont, throwArea, trumpIndicator, alertManager) {
		this.cardsCont = cardsCont;
		this.throwArea = throwArea;
		this.trumpIndicator = trumpIndicator;
		this.alertManager = alertManager;

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
		this.teamAHands = [];
		this.teamBHands = [];
		this.cardsOnBoardTimeout = 500;
		this.roundBestHand = 0;
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

		this.setTrump('c');
	}

	setTrump (suit) {
		const curTrumpIndicatorClass = this.trumpSuit === 'c' ?
			'club' :
			this.trumpSuit === 'd' ?
				'diamond' :
				this.trumpSuit === 'h' ?
					'heart' : 'spade';

		this.trumpSuit = suit;

		this.trumpIndicator.classList.remove(curTrumpIndicatorClass);
		this.trumpIndicator.classList.add(this.trumpSuit === 'c' ?
			'club' :
			this.trumpSuit === 'd' ?
				'diamond' :
				this.trumpSuit === 'h' ?
					'heart' : 'spade');
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

		this.cardOnBoard.push({ hand, card: playerPack.splice(playerPack.findIndex(testCard => testCard === card), 1)[0] });

		if (this.roundIndex === 0) this.leadSuit = card.suit;

		this.roundIndex = (this.roundIndex + 1) % 4;

		if (this.manager) this.manager.dropCard(hand);
	}

	endRound () {
		return new Promise(resolve => {
			let bestRecord = this.cardOnBoard[0];

			for (let a = 1; a < this.cardOnBoard.length; a++) {
				const record = this.cardOnBoard[a];
				const recordCard = record.card;
				const bestCard = bestRecord.card;

				if (recordCard.suit === this.trumpSuit) {
					if (bestCard.suit === this.trumpSuit) {
						if (bestCard.value < recordCard.value) {
							bestRecord = record;
						}

						continue;
					}

					bestRecord = record;
					continue;
				}

				if (bestCard.suit !== this.trumpSuit && bestCard.value < recordCard.value) bestRecord = record;
			}

			const beforeCardsOnBoardRemove = () => {
				const cardsOnBoardCopy = this.cardOnBoard.map(card => card);

				if (bestRecord.hand == 0) {
					this.teamAHands.push(cardsOnBoardCopy);
					this.cardOnBoard.forEach(record => record.card.dom.classList.add('remove-from-board-bottom'));
				} else if (bestRecord.hand == 1) {
					this.teamBHands.push(cardsOnBoardCopy);
					this.cardOnBoard.forEach(record => record.card.dom.classList.add('remove-from-board-right'));
				} else if (bestRecord.hand == 2) {
					this.teamAHands.push(cardsOnBoardCopy);
					this.cardOnBoard.forEach(record => record.card.dom.classList.add('remove-from-board-top'));
				} else {
					this.teamBHands.push(cardsOnBoardCopy);
					this.cardOnBoard.forEach(record => record.card.dom.classList.add('remove-from-board-left'));
				}
			}

			const removeCardsOnBoard = () =>{
				this.cardOnBoard.forEach(record => record.card.dom.remove());

				this.cardOnBoard.length = 0;
				this.roundBestHand = bestRecord.hand;

				resolve();
			}

			setTimeout(() => {
				beforeCardsOnBoardRemove();
				setTimeout(removeCardsOnBoard, this.cardsOnBoardTimeout * 0.5);
			}, this.cardsOnBoardTimeout * 0.5);
		});
	}

	alert (message, type = 'warning') {
		this.alertManager.alert(this.villageTalkMessages[message], type);
	}

	reset () {
		this.initPack();
	}

	static getRandomPacks (board) {
		const pack = board.pack.map(card => card);

		const packs = Array.from({ length: 4 }, () => new Array());

		for (let a = 7; a < 15; a++)
			for (let b = 0; b < 4; b++)
				packs[b].push(pack.splice(Math.floor(Math.random() * pack.length), 1)[0].toString());

		return packs;
	}
}

export {
	Card,
	Board
};
