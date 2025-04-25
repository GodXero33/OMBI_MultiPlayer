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

		this.playerCards = [];
		this.textures = [];
		this.pack = [];
		this.playerAPack = [];
		this.playerBPack = [];
		this.playerCPack = [];
		this.playerDPack = [];
		this.playerSymbol = 0; // 0 - player, 1 - opponent right, 2 - ally, 3 - opponent left
		this.currentChance = 0; // 0 - player, 1 - opponent right, 2 - ally, 3 - opponent left
		this.trumpSuit = 'c'; // c ♣ | d ♦ | h ♥ | s ♠
		this.leadCard = 'c'; // c ♣ | d ♦ | h ♥ | s ♠
		this.penaltyRedCards = [];
		this.penaltyBlackCards = [];

		this.cardHideTranslateY = 300;
		this.cardHideTimeout = 500;

		this.isCardsSettingUp = false;
		this.isCardsClearing = false;
		this.villageTalkMessages = null;

		this.#initPack();
	}

	#initPack () {
		this.pack.length = 0;
		this.penaltyRedCards.length = 0;
		this.penaltyBlackCards.length = 0;

		const suits = ['c', 'd', 'h', 's'];

		suits.forEach(suit => {
			for (let a = 7; a <= 14; a++)
				this.pack.push(new Card(suit, a));

			for (let a = 2; a <= 6; a++)
				(suit === 'c' || suit === 's' ? this.penaltyBlackCards : this.penaltyRedCards).push(new Card(suit, a));
		});
	}

	#getPlayerPack (playerSymbol) {
		return playerSymbol == 0 ?
			this.playerAPack :
			playerSymbol == 1 ?
				this.playerBPack :
				playerSymbol == 2 ?
					this.playerCPack :
					this.playerDPack;
	}

	setupCards () {
		return new Promise((resolve, rejects) => {
			if (this.isCardsSettingUp) {
				rejects();
				return;
			}

			this.isCardsSettingUp = true;

			this.playerCards.forEach(card => card.remove());

			this.playerCards = Array.from({ length: 8 }, (_, index) => {
				const cardDOM = document.createElement('div');
				const playerPack = this.#getPlayerPack(this.playerSymbol);
				const img = this.textures.get(playerPack[index].toString().replace('-', ''));

				playerPack[index].dom = cardDOM;
				cardDOM.style.transform = `translateY(${this.cardHideTranslateY}px)`;

				cardDOM.classList.add('card');
				cardDOM.appendChild(img);
				this.cardsCont.appendChild(cardDOM);

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
		const total = this.playerCards.length;

		const angleStep = 15;
		const gap = 20;

		const middleIndex = (total - 1) / 2;

		this.playerCards.forEach((card, index) => {
			const delta = index - middleIndex;

			card.style.transform = `translateX(${delta * gap}px) rotate(${delta * angleStep}deg)`;
		});
	}

	clearCards () {
		return new Promise((resolve, reject) => {
			if (this.isCardsClearing || this.playerCards.length == 0) {
				reject('Cards are already removed or removing');
				return;
			}

			this.isCardsClearing = true;

			const cards = this.playerCards.map(card => card);
			this.playerCards.length = 0;

			cards.forEach(card => card.style.transform = `translateY(${this.cardHideTranslateY}px)`);

			setTimeout(() => {
				this.isCardsClearing = false;

				cards.forEach(card => card.remove());
				resolve('Cards removed');
			}, this.cardHideTimeout);
		});
	}

	async setPack (jsonData) {
		try {
			this.playerAPack.length = this.playerBPack.length = this.playerCPack.length = this.playerDPack.length = 0;

			const data = JSON.parse(jsonData);
			const packMap = new Map();
			const playerPacks = [this.playerAPack, this.playerBPack, this.playerCPack, this.playerDPack];

			this.pack.forEach(card => packMap.set(card.toString(), card));

			for (let a = 0; a < 4; a++)
				for (let b = 0; b < 8; b++)
					playerPacks[a].push(packMap.get(data[a][b]));

			this.setupCards();
		} catch (error) {
			console.error(error);
		}
	}

	#dropCard (card, playerPack, hand) {
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

		playerPack.splice(playerPack.findIndex(testCard => testCard === card), 1);
		this.playerCards.splice(this.playerCards.findIndex(testDOM => testDOM === dom), 1);

		this.#updateCardsTransform();
	}

	onclick (event) {
		if (this.playerSymbol != this.currentChance) return;

		const clickedCard = this.pack.find(card => card.dom && (card.dom === event.target || card.dom.contains(event.target)));

		if (!clickedCard) return;

		const playerPack = this.#getPlayerPack(this.playerSymbol);

		if (clickedCard.suit === this.leadCard) {
			this.#dropCard(clickedCard, playerPack, this.playerSymbol);
			return;
		}

		if (playerPack.some(card => card.suit === this.leadCard)) {
			alert(this.villageTalkMessages['cardDoesNotMatchLeadSuit']);
			return;
		}

		this.#dropCard(clickedCard, playerPack, this.playerSymbol);
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
