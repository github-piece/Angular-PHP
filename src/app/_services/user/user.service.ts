import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {URL_SERVICIOS} from '../../../config/url.servicios';
import { User } from '../../_model/user/user';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  getAll() {
    return this.http.get<User[]>(`/users`);
  }

  getById(id: number) {
      return this.http.get(`/users/` + id);
  }

  register(user: User) {
    const action = 'action';
    const value = 'signup';
    user[action] = value;
    console.log(user);
    const url = `${URL_SERVICIOS}/user.php`;
    return this.http.post(url, user);
  }
  getFreezeFlag(u_id) {
    const action = 'freezeflag';
    return this.http.post<any>(`${URL_SERVICIOS}/user.php`, {  u_id, action })
        .pipe(map(userlist => {
            return userlist;
    }));

  }
  getUserList(u_accounttype, u_id) {
    const action = 'get';
    return this.http.post<any>(`${URL_SERVICIOS}/user.php`, { u_accounttype, u_id, action })
        .pipe(map(userlist => {
            return userlist;
    }));
  }

  changePwd(confirm_pwd: any, u_id: any, u_accounttype: any) {
    const action = 'changepwd';
    return this.http.post<any>(`${URL_SERVICIOS}/user.php`, { confirm_pwd, u_id, action, u_accounttype })
        .pipe(map(userlist => {
            return userlist;
    }));
  }

  freezeUser(u_id, u_accounttype, seleted_uid, userstate) {
    const action = 'freeze';
    return this.http.post<any>(`${URL_SERVICIOS}/user.php`, { u_id, u_accounttype, seleted_uid, action, userstate })
        .pipe(map(userlist => {
            return userlist;
    }));
  }

  createUser(username, u_email, u_pwd, u_accounttype,  radio_accounttype, u_id) {
    const action = 'aboutus_create.php';
    return this.http.post<any>(`${URL_SERVICIOS}/user.php`, { username, u_email, u_pwd, u_accounttype, action, radio_accounttype, u_id })
        .pipe(map(userlist => {
            return userlist;
    }));
  }

  updateUser(u_accounttype, seleted_uid, radio_accounttype) {
    const action = 'aboutus_update.php';
    return this.http.post<any>(`${URL_SERVICIOS}/user.php`, { u_accounttype, seleted_uid, action, radio_accounttype })
        .pipe(map(userlist => {
            return userlist;
    }));

  }


/*
  update(user: User) {
      return this.http.put(`/users/` + user.id, user);
  }

  delete(id: number) {
      return this.http.delete(`/users/` + id);
  }*/
}
