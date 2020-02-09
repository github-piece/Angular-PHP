import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import { throwError} from 'rxjs';
import {URL_SERVICIOS} from '../../../config/url.servicios';
import {catchError, map} from 'rxjs/operators';


@Injectable({
    providedIn: 'root'
})
export class AboutusService {

    SERVER_URL = 'http://127.0.0.1:8089';

    constructor(private http: HttpClient) {
    }
    getArticleList(formData) {
        return this.http.post<any>(`${URL_SERVICIOS}/aboutus.php`, formData)
            .pipe(map(articlelist => {
                console.log('articleList');
                console.log(articlelist);
                return articlelist;
            }));

    }
    articleSubmit(formData) {
        console.log(formData);
        return this.http.post<any>(`${URL_SERVICIOS}/aboutus.php`, formData)
            .pipe(map(articlelist => {
                return articlelist;
            }));
    }
    updateArticle(formData) {
        const _url = this.SERVER_URL + '/aboutus/update.php';

        return this.http.post(_url, formData, {
            headers: new HttpHeaders({
                'Accept': 'text/html, application/xhtml+xml, */*',
                'Content-Type': 'application/x-www-form-urlencoded'
            }),

        }).pipe(map((data) => {
                data = data['data'];
                console.log(data);
                return data;
            }),
            catchError(this.handleError));
    }
    deleteArticle(formData) {
        return this.http.post<any>(`${URL_SERVICIOS}/aboutus/delete.php`, formData)
            .pipe(map(articlelist => {
                console.log('articleList');
                console.log(articlelist);
                return articlelist;
            }));

    }
    handleError(error: HttpErrorResponse) {
        return throwError(error.message || '');
    }

}
