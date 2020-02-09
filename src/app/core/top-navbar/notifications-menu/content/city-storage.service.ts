import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CityStorageService {
  public cities: 'London';
  storageName = 'cities';
  constructor() {
    const existingCities = JSON.parse(localStorage.getItem(this.storageName));
    if (existingCities) {
      this.cities = existingCities;
    }
    console.log('Stored cities', this.cities);
  }
}
