export class World {
	private width:number;
	private height:number;
	private rectX:number = 50;
	private rectSpeed:number = 2;
	private playerImage:HTMLImageElement;
	private imageLoaded:boolean = false;

	constructor (width:number, height:number) {
		this.width = width;
		this.height = height;
		this.playerImage = new Image();
		
		this.playerImage.src = '/assets/images/player.png';

		this.playerImage.onload = () => {
			this.imageLoaded = true;
		};
	}

	update ():void {
		this.rectX += this.rectSpeed;

		if (this.rectX > this.width) {
			this.rectX = -200;
		}
	}

	draw (ctx:CanvasRenderingContext2D):void {
		ctx.clearRect(0, 0, this.width, this.height);

		if (this.imageLoaded) ctx.drawImage(this.playerImage, this.rectX, 100, 200, 100);
	}

	setSize (width:number, height:number):void {
		this.width = width;
		this.height = height;
	}
}
