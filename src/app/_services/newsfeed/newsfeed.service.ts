import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {URL_SERVICIOS} from '../../../config/url.servicios';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class NewsfeedService {

  constructor(private http: HttpClient) { }

  getArticleList_Admin(u_accounttype, u_id) {
    const action = 'get_admin';
    return this.http.post<any>(`${URL_SERVICIOS}/newsfeed.php`, { u_accounttype, u_id, action})
        .pipe(map(articlelist => {
          console.log('articlelist');
          console.log(articlelist);
            return articlelist;
    }));
  }
  getArticleList_User(u_accounttype, u_id) {
    const action = 'get_user';
    return this.http.post<any>(`${URL_SERVICIOS}/newsfeed.php`, { u_accounttype, u_id, action})
        .pipe(map(articlelist => {
            return articlelist;
    }));
  }
  getArticleList(u_accounttype, u_email) {
    const action = 'get_all';
    return this.http.post<any>(`${URL_SERVICIOS}/newsfeed.php`, { u_accounttype, u_email, action})
        .pipe(map(articlelist => {
            return articlelist;
    }));
  }
}
