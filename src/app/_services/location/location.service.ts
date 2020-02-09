import {Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class LocationService {

    constructor() {
    }

    getPosition(): Promise<any> {
        return new Promise((resolve, reject) => {

            navigator.geolocation.getCurrentPosition(resp => {

                    resolve({lng: Number(resp.coords.longitude), lat: Number(resp.coords.latitude)});
                },
                err => {
                    reject(err);
                });
        });

    }
}
