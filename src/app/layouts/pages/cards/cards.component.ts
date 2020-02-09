import { Component, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-cards-page',
  templateUrl: './cards.component.html',
  styleUrls: [ './styles/cards.scss' ],
  encapsulation: ViewEncapsulation.None
})

export class CardsPageComponent {

    cards2 = undefined;
    cards3 = undefined;
    cards4 = undefined;

    constructor(private route: ActivatedRoute) {
      const data = route.snapshot.data['data'];
      this.cards2 = data.cards2;
      this.cards3 = data.cards3;
      this.cards4 = data.cards4;
    }
}
