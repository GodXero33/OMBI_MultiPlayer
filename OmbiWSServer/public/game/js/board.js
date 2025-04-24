class Card {
	constructor (suit, value) {
		this.suit = suit;
		this.value = value;
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

		this.cardHideTranslateY = 300;
		this.cardHideTimeout = 500;

		this.isCardsSettingUp = false;
		this.isCardsClearing = false;

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
				
				const playerPack = this.playerSymbol == 0 ?
					this.playerAPack :
					this.playerSymbol == 1 ?
						this.playerBPack :
						this.playerSymbol == 2 ?
							this.playerCPack :
							this.playerDPack;

				const img = this.textures.get(playerPack[index].toString().replace('-', ''));

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

	setTextures (textures) {
		this.textures = textures;
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

	onclick (event) {
		const clickedCard = this.playerCards.find(cardDOM => cardDOM === event.target || cardDOM.contains(event.target));

		if (!clickedCard) return;

		console.log(clickedCard);
	}

	static getRandomPacks (board) {
		const pack = board.pack.map(card => card);

		const packs = Array.from({ length: 4 }, () => new Array());

		for (let a = 7; a < 15; a++) {
			packs[0].push(pack.splice(Math.floor(Math.random() * pack.length), 1)[0]?.toString());
			packs[1].push(pack.splice(Math.floor(Math.random() * pack.length), 1)[0]?.toString());
			packs[2].push(pack.splice(Math.floor(Math.random() * pack.length), 1)[0]?.toString());
			packs[3].push(pack.splice(Math.floor(Math.random() * pack.length), 1)[0]?.toString());
		}

		return packs;
	}
}

export {
	Card,
	Board
};
