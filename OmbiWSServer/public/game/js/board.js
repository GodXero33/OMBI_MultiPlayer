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
	constructor (cardsCont) {
		this.cardsCont = cardsCont;
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

		this.cardHideTranslateY = 300;
		this.cardHideTimeout = 500;

		this.isCardsSettingUp = false;
		this.isCardsClearing = false;
		this.villageTalkMessages = null;

		this.#initPack();
	}

	#initPack () {
		this.pack = [];

		const suits = ['c', 'd', 'h', 's'];

		suits.forEach(suit => {
			for (let a = 6; a < 14; a++) {
				this.pack.push(new Card(suit, a + 1));
			}
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

	#dropCard (card) {
		console.log(card);
	}

	onclick (event) {
		if (this.playerSymbol != this.currentChance) return;

		const clickedCard = this.pack.find(card => card.dom && (card.dom === event.target || card.dom.contains(event.target)));

		if (!clickedCard) return;

		if (clickedCard.suit === this.leadCard) {
			this.#dropCard(clickedCard);
			return;
		}

		const playerPack = this.#getPlayerPack(this.playerSymbol);

		const isPlayerHasLeadCards = playerPack.findIndex(card => card.suit === this.leadCard) != -1;

		if (isPlayerHasLeadCards) {
			alert(this.villageTalkMessages['cardDoesNotMatchLeadSuit']);
			return;
		}

		console.log(clickedCard, isPlayerHasLeadCards);
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
