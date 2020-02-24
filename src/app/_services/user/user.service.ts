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
  socialLogin(userData) {
    userData['action'] = 'social';
    return this.http.post<any>(`${URL_SERVICIOS}/user.php`, userData)
        .pipe(map(userInfo => {
          return userInfo;
        }));
  }
  // id: "117724762758623145180"
  // name: "Pu ChengLie"
  // email: "puchenglie@gmail.com"
  // photoUrl: "https://lh3.googleusercontent.com/-Z8yp9wsdUvI/AAAAAAAAAAI/AAAAAAAAAAA/ACHi3rdhuKgxy_4vyjPYYdjKPMqteGjLFg/s96-c/photo.jpg"
  // firstName: "Pu"
  // lastName: "ChengLie"
  // authToken: "ya29.a0Adw1xeWW-Sd64Pd9dAIAVmr2cIOffUPKU-20iM86v0MeTQvO0nbz4hpKs9P-EOvECXLaDodoekJj96d4lXioYxwxgDiyR41auzFCRkM6VFnGprXAKv5iD_FXmqcd7x1HpgQ2eUE5idBK4wz6UlVRNWRzAc_I8_PuO8lJ"
  // idToken: "eyJhbGciOiJSUzI1NiIsImtpZCI6Ijc5YzgwOWRkMTE4NmNjMjI4YzRiYWY5MzU4NTk5NTMwY2U5MmI0YzgiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJhY2NvdW50cy5nb29nbGUuY29tIiwiYXpwIjoiMzQwMDMzNTk5NTM5LThvNDJqbW9zZ3A1bDduaW9ub2s3MmM3Z3BwZWtua2d1LmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwiYXVkIjoiMzQwMDMzNTk5NTM5LThvNDJqbW9zZ3A1bDduaW9ub2s3MmM3Z3BwZWtua2d1LmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwic3ViIjoiMTE3NzI0NzYyNzU4NjIzMTQ1MTgwIiwiZW1haWwiOiJwdWNoZW5nbGllQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJhdF9oYXNoIjoiNGJPdDQ5bzZpdTh5UnQ3V1otNHU0USIsIm5hbWUiOiJQdSBDaGVuZ0xpZSIsInBpY3R1cmUiOiJodHRwczovL2xoMy5nb29nbGV1c2VyY29udGVudC5jb20vLVo4eXA5d3NkVXZJL0FBQUFBQUFBQUFJL0FBQUFBQUFBQUFBL0FDSGkzcmRodUtneHlfNHZ5alBZWWRqS1BNcXRlR2pMRmcvczk2LWMvcGhvdG8uanBnIiwiZ2l2ZW5fbmFtZSI6IlB1IiwiZmFtaWx5X25hbWUiOiJDaGVuZ0xpZSIsImxvY2FsZSI6ImVuIiwiaWF0IjoxNTgyNTA5MDM5LCJleHAiOjE1ODI1MTI2MzksImp0aSI6Ijk2NGY5NjViMDEyN2Q3NmJkZjI2ZTFhNTRhYTgwODdjNzVlYjU1OWMifQ.H_VHhOaOOrfUIgoOgjtXzt-0vzKU7wKAsGZ1gB5r7vsLAo7Qi7FkO-czn-dh53f5PyHm3NgABxY8sE0AomaK5CxaU1btuTfkcgpk_rkL7DF5wENrt1wZdBTyKr60XoeZd0gfpE6_T_muGLls1ecaaFOejqRtB20zaJ9ZWqVXrkrxZHOhjuuupuea7n5hO7lJJDWrVdOiiASMH213Bn-A8OFqu-Rv4zcxyrT3b2j25X3hX7xXfU_q15M6zEtRPJxvPpl_bGnbkhu7ZOWW5Nnhtc8hTF92Bde2sV9UYwDSAFCvcduEMvfU_FPLcsUAJLNtc-UtjtJGngj3f3o98aR9yg"
  // provider: "GOOGLE"
  // social: "social"
  getFreezeFlag(u_email) {
    const action = 'freezeflag';
    return this.http.post<any>(`${URL_SERVICIOS}/user.php`, {  u_email, action })
        .pipe(map(userlist => {
            return userlist;
    }));

  }
  getUserList(u_accounttype, u_email) {
    const action = 'get';
    return this.http.post<any>(`${URL_SERVICIOS}/user.php`, { u_accounttype, u_email, action })
        .pipe(map(userlist => {
            return userlist;
    }));
  }

  changePwd(confirm_pwd: any, u_email: any, u_accounttype: any) {
    const action = 'changepwd';
    return this.http.post<any>(`${URL_SERVICIOS}/user.php`, { confirm_pwd, u_email, action, u_accounttype })
        .pipe(map(userlist => {
            return userlist;
    }));
  }

  freezeUser(u_email, u_accounttype, seleted_uid, userstate) {
    const action = 'freeze';
    return this.http.post<any>(`${URL_SERVICIOS}/user.php`, { u_email, u_accounttype, seleted_uid, action, userstate })
        .pipe(map(userlist => {
            return userlist;
    }));
  }

  createUser(formData) {
    // const action = 'aboutus_create.php';
    return this.http.post<any>(`${URL_SERVICIOS}/user.php`, formData)
        .pipe(map(userlist => {
          console.log(userlist);
            return userlist;
    }));
  }

  updateUser(u_accounttype, seleted_uid, radio_accounttype) {
    // const action = 'aboutus_update.php';
    const action = 'update';
    return this.http.post<any>(`${URL_SERVICIOS}/user.php`, { u_accounttype, seleted_uid, action, radio_accounttype })
        .pipe(map(userlist => {
            return userlist;
    }));
  }

  uploadPhoto(formData) {
    return this.http.post<any>(`${URL_SERVICIOS}/user.php`, formData)
        .pipe(map(userlist => {
          return userlist;
        }));
  }
}
