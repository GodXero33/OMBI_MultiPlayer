class OMBICard {
	private image:HTMLImageElement;
	private card:HTMLDivElement;
	private suit:string;
	private value:number;

	constructor (image:HTMLImageElement, suit:string, value:number) {
		this.card = document.createElement('div');
		this.image = image;
		this.suit = suit;
		this.value = value;

		this.card.classList.add('card');
		this.card.appendChild(this.image);
	}

	public getValue ():number {
		return this.value;
	}

	public append (DOMParent:HTMLElement):void {
		if (DOMParent == null) return;

		DOMParent.appendChild(this.card);
	}
}

class OMBIBoard {
	private cards:Array<OMBICard>;
	private cardsDOMContainer:HTMLDivElement;
	private tableDOM!:HTMLDivElement;
	private playerDOMs!:Array<HTMLDivElement>;
	private cardBackImage!:HTMLImageElement;
	private cardImages:Array<HTMLImageElement>;

	constructor (container:HTMLDivElement, onResourceLoadedCallback?: () => void) {
		this.cards = new Array<OMBICard>(52);
		this.cardImages = new Array<HTMLImageElement>(52);
		this.cardsDOMContainer = container;

		this.getDOMs(container);
		this.loadImages(onResourceLoadedCallback);

		this.cards.forEach((card:OMBICard, index) => {
			if (card.getValue() > 6 || card.getValue() == 1) card.append(this.playerDOMs[index % 4]);
		});

		console.log(this);
	}

	private loadImages (onResourceLoadedCallback?: () => void):void {
		const suits:Array<string> = ['c', 'd', 'h', 's'];
		let loadedImagesCount:number = 0;
		let imagesLoaded:boolean = false;

		const loadImage = () => {
			loadedImagesCount++;
			imagesLoaded = loadedImagesCount == 52 + 1; // All 52 card images and back image.

			if (imagesLoaded && onResourceLoadedCallback) onResourceLoadedCallback();
		}

		suits.forEach((suit, suitIndex) => {
			for (let a = 0; a < 13; a++) {
				const image:HTMLImageElement = new Image();
				const card:OMBICard = new OMBICard(image, suit, a + 1);
				const index:number = suitIndex * 13 + a;

				this.cards[index] = card;
				this.cardImages[index] = image;
				image.src = `images/cards/${suit}${(a + 1).toString().padStart(2, '0')}.png`;
				image.onload = loadImage;
				image.onerror = () => console.error('failed to load card image: ' + image.src);
			}
		});

		this.cardBackImage = new Image();
		this.cardBackImage.src = 'images/cards/back.png';
		this.cardBackImage.onload = loadImage;
		this.cardBackImage.onerror = () => console.error('failed to load card image: ' + this.cardBackImage.src);
	}

	private getDOMs (container:HTMLDivElement):void {
		const divs:Array<HTMLDivElement> = Array.from(container.querySelectorAll(':scope > div'));

		this.tableDOM = divs[0];
		this.playerDOMs = [divs[1], divs[2], divs[3], divs[4]];
	}
}

export {
	OMBIBoard
};
