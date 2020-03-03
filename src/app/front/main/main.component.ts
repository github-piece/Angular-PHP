import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  onShow: any;
  constructor() { }

  ngOnInit() {
    this.onShow = localStorage.getItem('siteShow');
  }
  match() {
    const value = document.getElementById('password')['value'];
    if (value === 'mseangularsite') {
      this.onShow = 'ok';
      localStorage.setItem('siteShow', this.onShow);
    }
  }

}
