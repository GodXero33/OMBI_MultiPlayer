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
}
