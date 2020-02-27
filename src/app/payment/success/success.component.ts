import {Component, OnInit} from '@angular/core';
import {BuysellService} from '../../_services/buysell/buysell.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-success',
  templateUrl: './success.component.html',
  styleUrls: ['../payment.scss'],
})
export class SuccessComponent implements OnInit {
  payData: any;
  constructor( private buysellService: BuysellService,
               private route: ActivatedRoute,
               private router: Router
  ) { }

  ngOnInit() {
    this.payData = JSON.parse(localStorage.getItem('payData'));
  }
  setHistory() {
    const userId = this.payData['userId'];
    const businessId = this.payData['businessId'];
    const balance = this.payData['balance'];
    const amount = this.payData['amount'];
    const fund = this.payData['fund'];
    const rate = this.payData['rate'];
    const frequency = this.payData['frequency'];
    this.buysellService.buy(userId, businessId, balance, amount, fund, rate, frequency);
    localStorage.removeItem('payData');
    this.router.navigate(['/pages/catalogue']);
  }
}
