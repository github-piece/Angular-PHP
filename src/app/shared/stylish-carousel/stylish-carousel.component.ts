import { Component, ViewEncapsulation, AfterContentInit } from '@angular/core';

@Component({
  selector: 'app-stylish-carousel',
  templateUrl: './stylish-carousel.component.html',
  styleUrls: [
    './styles/stylish-carousel.styles.scss'
  ],
  encapsulation: ViewEncapsulation.None
})
export class StylishCarouselComponent implements AfterContentInit {

  constructor() {}

  ngAfterContentInit() {
  }
}
