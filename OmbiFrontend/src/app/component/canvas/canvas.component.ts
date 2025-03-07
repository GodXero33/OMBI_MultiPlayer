import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { World } from './world';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.css']
})
export class CanvasComponent implements OnInit {
  @ViewChild('myCanvas', { static: true }) canvas!:ElementRef<HTMLCanvasElement>;
  private ctx!:CanvasRenderingContext2D | null;
  private animationFrameId:number = 0;
  private width:number = window.innerWidth;
  private height:number = window.innerHeight;
  private world!:World;

  ngOnInit ():void {
    this.ctx = this.canvas.nativeElement.getContext('2d');
    this.world = new World(this.width, this.height);

    this.resizeCanvas();
    this.animate();
  }

  // Resize canvas to full screen
  resizeCanvas ():void {
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    const canvasEl = this.canvas.nativeElement;
    canvasEl.width = this.width;
    canvasEl.height = this.height;

    if (this.world) {
      this.world.setSize(this.width, this.height);
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

    this.world.update();
    this.world.draw(this.ctx);

    this.animationFrameId = requestAnimationFrame(() => this.animate());
  }

  // Stop animation when component is destroyed
  ngOnDestroy ():void {
    cancelAnimationFrame(this.animationFrameId);
  }
}
