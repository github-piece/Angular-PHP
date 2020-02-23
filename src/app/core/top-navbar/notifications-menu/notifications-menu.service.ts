import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {URL_SERVICIOS} from '../../../../config/url.servicios';
import {map} from 'rxjs/operators';

@Injectable()
export class NotificationsMenuService {
  constructor(private http: HttpClient) {
  }
  sidenav: any;

  notifications = [
    {
      type: 'social',
      title: 'Social',
      text: 'Important Message',
      time: 'JUST NOW'
    },
    {
      type: 'alert',
      title: 'Removed 6 items...',
      text: 'Important Message',
      time: 'Yesterday'
    },
    {
      type: 'promotion',
      title: 'Promotion',
      text: 'Important Message',
      time: 'June 4'
    },
    {
      type: 'aboutus_update.php',
      title: 'Updates',
      text: 'Important Message',
      time: 'June 2'
    },
    {
      type: 'done',
      title: 'Completed 2 proyects',
      text: 'Important Message',
      time: 'May 28'
    },
    {
      type: 'contact',
      title: 'Added Jim to contact list',
      text: 'Important Message',
      time: 'May 25'
    }
  ];

  getNotifications(): Promise<Array<any>> {
    return new Promise((resolve, reject) => {
      setTimeout(() => resolve (this.notifications), 1000);
    });
  }

}
