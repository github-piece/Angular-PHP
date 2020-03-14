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
        return this.http.post<any>(`${URL_SERVICIOS}/answer.php`, formData, {responseType: 'json'})
            .pipe(map(res => {
                return res;
            }));

    }
    excelAnswer(excelAnswers, userId, time) {
        return this.http.post<any>(`http://localhost:3000/getAnswer`, { excelAnswers, userId, time })
            .pipe(map(res => {
                return res;
            }));
    }
}
