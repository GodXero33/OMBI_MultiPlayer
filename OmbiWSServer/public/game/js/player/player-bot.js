import OMBIPlayer from "./player.js";

export default class OMBIBotPlayer extends OMBIPlayer {
	constructor (board, symbol) {
		super(board, symbol);

		this.waitTime = 500;
	}

	getBestCardWithCardsOnBoard () {
		const leadCards = this.pack.filter(card => card.suit === this.board.leadSuit);

		if (leadCards.length == 0) {
			const trumpCards = this.pack.filter(card => card.suit === this.board.trumpSuit);

			if (trumpCards.length == 0) return this.pack[Math.floor(Math.random() * this.pack.length)];

			return trumpCards[Math.floor(Math.random() * trumpCards.length)];
		}

		return leadCards[Math.floor(Math.random() * leadCards.length)];
	}

	getBestCardWithoutCardsOnBoard () {
		// when bot needs to decide best card only from cards in hand. for now just throw random card.
		console.log('random select');
		return this.pack[Math.floor(Math.random() * this.pack.length)];
	}

	getBestCard (isRoundFirst) {
		if (isRoundFirst) return this.getBestCardWithoutCardsOnBoard();
		return this.getBestCardWithCardsOnBoard();
	}

	requestMove (isRoundFirst = false) {
		const bestCardInHand = this.getBestCard(isRoundFirst);

		setTimeout(() => {
			this.board.dropCard(bestCardInHand, this.pack, this.symbol);
		}, this.waitTime);
	}

	chooseTrump () {
		const packCountMap = new Map();
		const packValueMap = new Map();

		this.pack.forEach(card => packCountMap.set(card.suit, packCountMap.has(card.suit) ? packCountMap.get(card.suit) + 1 : 1));
		this.pack.forEach(card => packValueMap.set(card.suit, packValueMap.has(card.suit) ? packValueMap.get(card.suit) + card.value : card.value));

		let maxCountSuit = null;
		let maxCount = -Infinity;

		for (const [suit, count] of packCountMap) {
			if (count > maxCount) {
				maxCount = count;
				maxCountSuit = suit;
			}
		}

		let maxValueSuit = null;
		let maxValue = -Infinity;

		for (const [suit, value] of packValueMap) {
			if (value > maxValue) {
				maxValue = value;
				maxValueSuit = suit;
			}
		}

		this.board.setTrump(Math.random() > 0.5 ? maxCountSuit : maxValueSuit);
	}
}
