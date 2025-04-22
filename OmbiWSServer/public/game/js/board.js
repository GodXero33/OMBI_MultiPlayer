export default class Board {
	constructor (cardsCont) {
		this.cardsCont = cardsCont;
		this.playerCards = [];

		this.cardHideTranslateY = 300;
		this.cardHideTimeout = 500;

		this.isCardsSettingUp = false;
		this.isCardsClearing = false;
	}

	setupCards () {
		return new Promise((resolve, rejects) => {
			if (this.isCardsSettingUp) {
				rejects();
				return;
			}

			this.isCardsSettingUp = true;

			this.playerCards.forEach(card => card.remove());

			this.playerCards = Array.from({ length: 8 }, () => {
				const card = document.createElement('div');

				card.style.transform = `translateY(${this.cardHideTranslateY}px)`;

				card.classList.add('card');
				this.cardsCont.appendChild(card);

				return card;
			});

			setTimeout(() => {
				this.isCardsSettingUp = false;

				this.#updateCardsTransform();
				resolve('Cards setup ok');
			}, this.cardHideTimeout);
		});
	}

	#updateCardsTransform () {
		const total = this.playerCards.length;
		const maxAngle = 45;
		const gap = 20;

		const spread = total > 1 ? (maxAngle * 2) / (total - 1) : 0;

		this.playerCards.forEach((card, i) => {
			const rotate = -maxAngle + (spread * i);
			const offset = (i - (total - 1) / 2) * gap;

			card.style.transform = `translateX(${offset}px) rotate(${rotate}deg)`;
		});
	}

	clearCards () {
		return new Promise((resolve, reject) => {
			if (this.isCardsClearing || this.playerCards.length == 0) {
				reject('Cards are already removed or removing');
				return;
			}

			this.isCardsClearing = true;

			const cards = this.playerCards.filter(card => card);
			this.playerCards.length = 0;

			cards.forEach(card => card.style.transform = `translateY(${this.cardHideTranslateY}px)`);

			setTimeout(() => {
				this.isCardsClearing = false;

				cards.forEach(card => card.remove());
				resolve('Cards removed');
			}, this.cardHideTimeout);
		});
	}
}
