import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-cancel',
  templateUrl: './cancel.component.html',
  styleUrls: ['../payment.scss'],
})
export class CancelComponent implements OnInit {
  payData: any;
  constructor(
      private route: ActivatedRoute,
      private router: Router
  ) { }

  ngOnInit() {
    this.payData = JSON.parse(localStorage.getItem('payData'));
  }
  return() {
    localStorage.removeItem('payData');
    this.router.navigate(['/pages/catalogue']);
  }
}
