import {Injectable} from '@angular/core';
import {map} from 'rxjs/operators';
import {URL_SERVICIOS} from '../../../config/url.servicios';
import {HttpClient} from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class ArticleService {

    constructor(private http: HttpClient) {
    }

    articleSubmit(formData) {
        return this.http.post<any>(`${URL_SERVICIOS}/article.php`, formData)
            .pipe(map(articlelist => {
                return articlelist;
            }));
    }

    deleteArticle(formData) {
        return this.http.post<any>(`${URL_SERVICIOS}/article.php`, formData)
            .pipe(map(articlelist => {
                return articlelist;
            }));
    }

    getArticleList(formData) {
        return this.http.post<any>(`${URL_SERVICIOS}/article.php`, formData)
            .pipe(map(articlelist => {
                console.log('articleList');
                console.log(articlelist);
                return articlelist;
            }));

    }

}
