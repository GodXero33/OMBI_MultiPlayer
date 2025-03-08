class OMBICard {
	private width:number;
	private height:number;
	private x:number;
	private y:number;
	private image:HTMLImageElement;

	constructor (image:HTMLImageElement) {
		this.image = image;
		this.width = 0;
		this.height = 0;
		this.x = 0;
		this.y = 0;
	}

	resize (width:number):void {
		const asp = this.image.naturalWidth / this.image.naturalHeight;
		this.width = width;
		this.height = width / asp;
	}

	update ():void {}

	draw (ctx:CanvasRenderingContext2D):void {
		ctx.drawImage(this.image, this.x - this.width * 0.5, this.y - this.height * 0.5, this.width, this.height);
	}
}

class OMBIBoard {
	private width:number;
	private height:number;
	private cards:Array<OMBICard>;

	constructor (width:number, height:number, onResourceLoadedCallback?: () => void) {
		this.width = width;
		this.height = height;
		this.cards = new Array<OMBICard>(52);

		const suits:Array<string> = ['c', 'd', 'h', 's'];
		let loadedImagesCount:number = 0;
		let imagesLoaded:boolean = false;

		const loadImage = () => {
			loadedImagesCount++;
			imagesLoaded = loadedImagesCount == 52;

			if (imagesLoaded && onResourceLoadedCallback) onResourceLoadedCallback();
		}

		suits.forEach((suit, suitIndex) => {
			for (let a = 0; a < 13; a++) {
				const image:HTMLImageElement = new Image();
				const card:OMBICard = new OMBICard(image);

				this.cards[suitIndex * 13 + a] = card;
				image.src = `images/cards/${suit}${(a + 1).toString().padStart(2, '0')}.png`;
				image.onload = () => {
					loadImage();
					card.resize(200);
				}

				image.onerror = () => {
					console.error('failed to load card image: ' + image.src);
				}
			}
		});

		console.log(this);
	}

	update ():void {
		this.cards.forEach(card => card.update());
	}

	draw (ctx:CanvasRenderingContext2D):void {
		ctx.clearRect(0, 0, this.width, this.height);
		this.cards.forEach(card => card.draw(ctx));
	}

	setSize (width:number, height:number):void {
		this.width = width;
		this.height = height;
	}
}

export {
	OMBIBoard
};
