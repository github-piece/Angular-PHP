import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {URL_SERVICIOS} from '../../../config/url.servicios';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ForgotpwdService {

  constructor(private http: HttpClient) { }
  sendmail( u_email: string) {
    const action = 'sendmail';

    return this.http.post<any>(`${URL_SERVICIOS}/user.php`, { u_email, action })
        .pipe(map(user => {
            // login successful if there's a jwt token in the response
        }));
  }
}
