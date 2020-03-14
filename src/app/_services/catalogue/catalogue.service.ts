import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {URL_SERVICIOS} from '../../../config/url.servicios';
import {map} from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class CatalogueService {

    constructor(private http: HttpClient) {
    }
    getBusinessList(userId) {
        return this.http.post<any>(`http://localhost:3000/getCategory`, {userId})
            .pipe(map(business_info => {
                return business_info;
            }));
    }
    getDataForChart(userid: string) {
        return this.http.post<any>(`${URL_SERVICIOS}/chartdata.php`, {userid})
            .pipe(map(catalogue => {
                return catalogue;
            }));
    }
    setBusinessList(userid: string, questionTypeID: string) {
        const action = 'create';
        return this.http.post<any>(`${URL_SERVICIOS}/catalogue.php`, {userid, questionTypeID, action})
            .pipe(map(result => {
                return result;
            }));
    }
    setBusinessListByExcel(userid: string, questionTypeID: string) {
        const action = 'createByExcel';
        return this.http.post<any>(`${URL_SERVICIOS}/catalogue.php`, {userid, questionTypeID, action})
            .pipe(map(result => {
                return result;
            }));
    }
    getTabData(userid, mainBusiness, tab) {
        const action = 'readTab';
        return this.http.post(`${URL_SERVICIOS}/catalogue.php`, {userid, mainBusiness, tab, action}).pipe(map(data => {
            return data;
        }));
    }
}
