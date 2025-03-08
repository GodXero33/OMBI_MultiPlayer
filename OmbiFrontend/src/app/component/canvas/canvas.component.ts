import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { OMBIBoard } from './ombi-board';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.css']
})
export class CanvasComponent implements OnInit {
  @ViewChild('myCanvas', { static: true }) canvas!:ElementRef<HTMLCanvasElement>;
  @ViewChild('loadingCover', { static: true }) loadingCover!:ElementRef<HTMLDivElement>;
  private ctx!:CanvasRenderingContext2D | null;
  private animationFrameId:number = 0;
  private width:number = window.innerWidth;
  private height:number = window.innerHeight;
  private board!:OMBIBoard;

  ngOnInit ():void {
    this.ctx = this.canvas.nativeElement.getContext('2d');
    this.board = new OMBIBoard(this.width, this.height, this.onResourceLoaded.bind(this));
  }

  onResourceLoaded ():void {
    setTimeout(() => {
      this.loadingCover.nativeElement.classList.add('hide');
      this.resizeCanvas();
      this.animate();
    }, 500);
  }

  // Resize canvas to full screen
  resizeCanvas ():void {
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    const canvasEl = this.canvas.nativeElement;
    canvasEl.width = this.width;
    canvasEl.height = this.height;

    if (this.board) {
      this.board.setSize(this.width, this.height);
    }
  }

  // Listen for window resize and adjust canvas
  @HostListener('window:resize', ['$event'])
  onResize ():void {
    this.resizeCanvas();
  }

  // Animation loop
  animate ():void {
    if (!this.ctx) return;

    this.board.update();

    const transform:DOMMatrix = this.ctx.getTransform();

    this.ctx.translate(this.width * 0.5, this.height * 0.5);
    this.board.draw(this.ctx);

    this.ctx.setTransform(transform);

    this.animationFrameId = requestAnimationFrame(() => this.animate());
  }

  // Stop animation when component is destroyed
  ngOnDestroy ():void {
    cancelAnimationFrame(this.animationFrameId);
  }
}
