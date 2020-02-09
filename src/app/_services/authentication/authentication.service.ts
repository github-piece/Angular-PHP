import { Injectable } from '@angular/core';
import { User } from '../../_model/user/user';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {URL_SERVICIOS} from '../../../config/url.servicios';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  public currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  login(u_email: string, u_password: string) {
    const action = 'login';
    console.log(u_email, u_password);
    return this.http.post<any>(`${URL_SERVICIOS}/user.php`, { u_email, u_password, action })
        .pipe(map(user => {
            // login successful if there's a jwt token in the response
            if (user) {
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                localStorage.setItem('currentUser', JSON.stringify(user));
                this.currentUserSubject.next(user);

            }

            return user;
        }));
  }

  logout() {
      localStorage.removeItem('currentUser');
      this.currentUserSubject.next(null);
  }


}
