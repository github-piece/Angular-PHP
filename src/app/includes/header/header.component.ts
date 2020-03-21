import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  show = '';
  init = 0;
  auth = false;
  constructor() { }

  ngOnInit() {
  }
  onShow() {
    this.init = (this.init + 1) % 2;
    if (this.init === 0) {
      this.show = '';
      this.auth = false;
    } else {
      this.show = 'show';
      this.auth = true;
    }
  }

}
