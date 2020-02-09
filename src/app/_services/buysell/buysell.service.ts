import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {URL_SERVICIOS} from '../../../config/url.servicios';

@Injectable({
  providedIn: 'root'
})
export class BuysellService {
  public rowData: any = [];
  public business_id: any;
  public business_remain: any;
  public business_name: any;
  public modal_content: any;
  public action: any;
  public commission: any;
  constructor(private http: HttpClient) { }

  getHistory(userid, action) {
    const url = `${URL_SERVICIOS}/buysell.php`;
    return this.http.post(url, {userid, action});
  }

  getPortfolio(userid) {
    const action = 'get_portfolio';
    const url = `${URL_SERVICIOS}/buysell.php`;
    return this.http.post(url, {userid, action});
  }

  buy(business_id, amount, userid) {
    const action = 'buy';
    const url = `${URL_SERVICIOS}/buysell.php`;
    return this.http.post(url, {business_id, amount, userid, action});
  }

  sell(business_id, amount, userid) {
    console.log('businessId = ', business_id);
    const action = 'sell';
    const url = `${URL_SERVICIOS}/buysell.php`;
    return this.http.post(url, {business_id, amount, userid, action});
  }
}
