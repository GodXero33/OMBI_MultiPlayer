import OMBIPlayer from "./player.js";

export default class OMBIUserPlayer extends OMBIPlayer {
	constructor (board, symbol) {
		super(board, symbol);

		this.canClick = true;

		this.board.cardsCont.addEventListener('click', event => {
			if (!this.canClick) return;

			const clickedCard = this.pack.find(card => card.dom && (card.dom === event.target || card.dom.contains(event.target)));

			if (!clickedCard) return;

			if (this.board.roundIndex == 0 || clickedCard.suit === this.board.leadSuit) {
				this.canClick = false;

				this.board.dropCard(clickedCard, this.pack, this.symbol);
				this.#updateCardsTransform();
				return;
			}

			if (this.pack.some(card => card.suit === this.board.leadSuit)) {
				this.board.alert('cardDoesNotMatchLeadSuit');
				return;
			}

			this.board.dropCard(clickedCard, this.pack, this.symbol);
			this.#updateCardsTransform();
		});
	}

	setupCards () {
		return new Promise((resolve, rejects) => {
			if (this.isCardsSettingUp) {
				rejects();
				return;
			}

			this.isCardsSettingUp = true;

			this.pack.forEach(card => card.dom.remove());

			this.playerCards = Array.from({ length: 8 }, (_, index) => {
				const cardDOM = this.pack[index].dom;

				cardDOM.style.transform = `translateY(${this.cardHideTranslateY}px)`;

				this.board.cardsCont.appendChild(cardDOM);

				return cardDOM;
			});

			setTimeout(() => {
				this.isCardsSettingUp = false;

				this.#updateCardsTransform();
				resolve('Cards setup ok');
			}, this.cardHideTimeout);
		});
	}

	#updateCardsTransform () {
		const total = this.pack.length;

		const angleStep = 15;
		const gap = 20;

		const middleIndex = (total - 1) / 2;

		this.pack.forEach((card, index) => {
			const delta = index - middleIndex;

			card.dom.style.transform = `translateX(${delta * gap}px) rotate(${delta * angleStep}deg)`;
		});
	}

	requestMove (isRoundFirst = false) {
		this.canClick = true;
		this.board.alert('playerChance', 'info');
	}
}
