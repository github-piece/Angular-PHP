import {Component, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {WeatherModel, WeatherService, WeatherType} from '../../../../_services/weather/weather.service';
import {ActivatedRoute, Router} from '@angular/router';
import {CityStorageService} from './city-storage.service';

@Component({
  selector: 'app-notifications-menu-content',
  styleUrls: [
    './styles/notifications-menu-content.scss'
  ],
  templateUrl: './notifications-menu-content.component.html',
  encapsulation: ViewEncapsulation.None
})

export class NotificationsMenuContentComponent implements OnInit {
  @Input() notifications = [];
  today: number = Date.now();
  city: string;
  weather: WeatherModel;
  failedToLoad: boolean;

  // This is to allow the enum to be used in the template;
  WeatherType = WeatherType;

  constructor(public weatherService: WeatherService, private route: ActivatedRoute,
              public cityStorage: CityStorageService, private router: Router) {

  }

  ngOnInit() {
    this.route.paramMap.subscribe(route => {
      this.city = 'London';
      this.reset();
      this.weatherService.getCurrentWeather(this.city).subscribe(x => {
            this.weather = x;
          },
          error => {
            console.log('error occured', error);
            this.failedToLoad = true;
          });
    });
  }



  reset() {
    this.failedToLoad = false;
    this.weather = undefined;
  }

  isDay() {
    const now = new Date();
    return (this.weather.sunrise < now && this.weather.sunset > now);
  }
}
