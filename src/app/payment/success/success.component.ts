import {Component, NgZone, OnInit} from '@angular/core';

@Component({
  selector: 'app-success',
  templateUrl: './success.component.html',
  styleUrls: ['../payment.scss'],
})
export class SuccessComponent implements OnInit {
  onShow: any;
  constructor( private ngZone: NgZone ) {
    window.onresize = (e) => {
      this.ngZone.run(() => {
        this.onShow = window.innerWidth >= 768;
      });
    };
  }

  ngOnInit() {
    this.onShow = window.innerWidth >= 768;
  }
}
