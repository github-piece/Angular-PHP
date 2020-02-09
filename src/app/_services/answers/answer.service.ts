import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {URL_SERVICIOS} from '../../../config/url.servicios';
import {map} from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class AnswerService {
    constructor(private  http: HttpClient) {
    }

    putAnswer(formData: FormData) {
        const url = `${URL_SERVICIOS}/answer.php`;
        return this.http.post<any>(url, formData, {responseType: 'json'})
            .pipe(map(res => {
                return res;
            }));

    }
}
