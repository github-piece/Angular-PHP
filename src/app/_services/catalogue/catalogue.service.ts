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

    getBusinessList(userid: string) {
        let action = 'read';
        return this.http.post<any>(`${URL_SERVICIOS}/catalogue.php`, {userid,action})
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
    //Call when the current user click finish button.
    setBusinessList(userid:string,questionTypeID:string){
        let action = 'create';
        return this.http.post<any>(`${URL_SERVICIOS}/catalogue.php`,{userid,questionTypeID,action})
            .pipe(map(result=>{
                return result;
            }));
    }
}
