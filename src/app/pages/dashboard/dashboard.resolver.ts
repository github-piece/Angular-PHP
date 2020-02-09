import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';

@Injectable()
export class DashboardResolver implements Resolve<any> {

  constructor(

  ) { }

  resolve() {
    return new Promise((resolve, reject) => {
      const breadcrumbs = [
        { url: '/', label: 'Home' }
      ];

      return resolve({
        // breadcrumbs: breadcrumbs
      });
    });
  }
}
