import { Injectable } from '@angular/core';
import {URL_SERVICIOS} from '../../../config/url.servicios';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PayfastService {

  constructor(private http: HttpClient) { }
  generateSignature(formData: FormData) {
    const url = `${URL_SERVICIOS}/paymentGateway/signature.php`;
    return this.http.post<any>(url, formData, {responseType: 'json'})
        .pipe(map(res => {
          return res;
        }));
  }
}
