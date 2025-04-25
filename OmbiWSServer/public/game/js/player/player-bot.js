import OMBIPlayer from "./player.js";

export default class OMBIBotPlayer extends OMBIPlayer {
	constructor (board, symbol) {
		super(board, symbol);

		this.waitTime = 10;
	}

	getBestCard () {
		const leadCards = this.pack.filter(card => card.suit === this.board.leadSuit);
		const trumpCards = this.pack.filter(card => card.suit === this.board.trumpSuit);

		if (leadCards.length == 0) {
			if (trumpCards.length == 0) {
				return this.pack[Math.floor(Math.random() * this.pack.length)];
			}

			return trumpCards[Math.floor(Math.random() * trumpCards.length)];
		}

		return leadCards[Math.floor(Math.random() * leadCards.length)];
	}

	requestMove () {
		const bestCardInHand = this.getBestCard();

		setTimeout(() => {
			this.board.dropCard(bestCardInHand, this.pack, this.symbol);
		}, this.waitTime);
	}
}
