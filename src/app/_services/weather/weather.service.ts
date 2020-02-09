import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {delay, map} from 'rxjs/operators';
import {ConfigService} from '../../core/top-navbar/notifications-menu/content/config.service';

@Injectable({
  providedIn: 'root'
})
// export class WeatherService {
//
//   constructor(private http: HttpClient) { }
//
//   public WORLDWEATHERURL = 'http://api.worldweatheronline.com/premium/v1/marine.ashx?key=f70a4cd69f314b58b6e172113191412&format=json&q=45,-2&tide=yes';
//
//   getWeatherInfo(location) {
//     return this.http.get(this.WORLDWEATHERURL + '/marine.ashx?key=' + 'f70a4cd69f314b58b6e172113191412' +
//         '&format=json&q=' + location.lat + ',' + location.long + '&tide=yes&tp=1');
//   }
//
//   getWeatherIcons(location) {
//     return this.http.get(this.WORLDWEATHERURL + '/weather.ashx?key=' + 'f70a4cd69f314b58b6e172113191412' +
//         '&format=json&q=' + location.lat + ',' + location.long + '&num_of_days=3&cc=no&tp=24');
//   }
//
// }
export class WeatherService {
  apiKey = '665d48140dca13e411595586a256c4ce';
  unit = 'metric';
  weatherModels: WeatherModel[] = [];

  constructor(private httpClient: HttpClient) {
  }

  getCurrentWeather(city: string): Observable<WeatherModel> {
    const existing = this.weatherModels.find(w => w.city.toLocaleLowerCase() === city.toLocaleLowerCase());
    if (existing) {
      return of(existing);
    }
    const apiCall = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${this.unit}&APPID=${this.apiKey}`;
    console.log('apiCall', apiCall);
    return this.httpClient.get<any>(apiCall).pipe(
        map(resp => {
          console.log('Response', resp);
          const weather = resp.weather[0];
          const temp = resp.main.temp;
          const sunrise = resp.sys.sunrise * 1000;
          const sunset = resp.sys.sunset * 1000;
          const model = new WeatherModel(city, getWeatherType(weather.id), weather.description, temp,
              new Date(sunrise), new Date(sunset));
          this.weatherModels.push(model);

          return model;
        }));
  }
}
export class WeatherModel {
  constructor(readonly city: string, readonly type: WeatherType, readonly description: string,
              readonly tempature: number, readonly sunrise: Date, readonly sunset: Date) {
  }
}
function getWeatherType(weatherId: number): WeatherType {
  if (weatherId >= 200 && weatherId < 300) {
    return WeatherType.lightning;
  }

  if (weatherId >= 300 && weatherId < 600) {
    return WeatherType.rain;
  }

  if (weatherId >= 600 && weatherId < 700) {
    return WeatherType.snow;
  }

  if (weatherId >= 700 && weatherId < 800) {
    return WeatherType.fog;
  }

  if (weatherId === 800) {
    return WeatherType.clear;
  }

  if (weatherId === 801) {
    return WeatherType.partialClear;
  }


  if (weatherId >= 801 && weatherId < 900) {
    return WeatherType.cloud;
  }

  return WeatherType.unknown;
}
export enum WeatherType {
  cloud,
  fog,
  clear,
  rain,
  partialClear,
  lightning,
  snow,
  unknown
}

@Injectable()
export class DevelopmentWeatherService {
  getCurrentWeather(city: string): Observable<WeatherModel> {
    const sunrise = new Date();
    sunrise.setHours(sunrise.getHours() - 2);

    const sunset = new Date();
    sunset.setHours(sunset.getHours() + 2);

    const weather = new WeatherModel(city, WeatherType.clear, 'clear', 12.2,
        sunrise, sunset);
    // of(x).pipe(delay(2000)) allows you to mimic delays
    // that can happen when you call the real api.
    return of(weather).pipe(delay(1000));

    // throwError can mimic errors from the API call.
    // return throwError('mimic an api failure');

    // const error = new Error();
    // error['status'] = 400;
    // return throwError(error).pipe(materialize(), delay(2000), dematerialize());
  }
}


export function weatherServiceFactory(httpClient: HttpClient, configService: ConfigService) {
  let service: any;

  if (configService.inMemoryApi) {
    service = new DevelopmentWeatherService();
  } else {
    service = new WeatherService(httpClient);
  }
  return service;
}

export let weatherServiceProvider = {
  provide: WeatherService,
  useFactory: weatherServiceFactory,
  deps: [HttpClient, ConfigService]
};

