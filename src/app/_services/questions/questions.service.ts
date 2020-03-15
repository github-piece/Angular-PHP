import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {URL_SERVICIOS} from '../../../config/url.servicios';
import {map} from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class QuestionsService {

    constructor(private http: HttpClient) {
    }
    create(formData) {
        return true;
    }
    read(userid, profile, action) {
        return this.http.post<any>(`${URL_SERVICIOS}/question.php`, {userid, profile, action})
            .pipe(map(questions => {
                return questions;
            }));
    }
    update() {

    }
    delete() {

    }
    getQuestionnaireList(userid: string, profile: string) {
        return this.read(userid, profile, 'read');
    }
}
