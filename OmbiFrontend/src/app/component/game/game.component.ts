import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { OMBIBoard } from './ombi-board';

@Component({
  selector: 'app-canvas',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class CanvasComponent implements OnInit {
  @ViewChild('cardsContainer', { static: true }) cardsContainer!:ElementRef<HTMLDivElement>;
  @ViewChild('loadingCover', { static: true }) loadingCover!:ElementRef<HTMLDivElement>;
  private board!:OMBIBoard;

  ngOnInit ():void {
    this.board = new OMBIBoard(this.cardsContainer.nativeElement, this.onResourceLoaded.bind(this));
  }

  onResourceLoaded ():void {
    setTimeout(() => {
      this.loadingCover.nativeElement.classList.add('hide');
    }, 500);
  }
}
