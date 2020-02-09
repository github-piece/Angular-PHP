import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-ng2-charts-page',
  templateUrl: './ng2-charts.component.html',
  styleUrls: ['./styles/ng2-charts.scss']
})
export class Ng2ChartsPageComponent {
  data: any = {};
  isBrowser: boolean;

  // Library references
  // https://github.com/valor-software/ng2-charts
  // https://valor-software.com/ng2-charts/
  // http://www.chartjs.org/docs/latest/

  constructor(
    route: ActivatedRoute,
    sanitizer: DomSanitizer,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.data = route.snapshot.data['data'];
    console.log('data',this.data);
    // <canvas> element, which is not supported by the SSR DOM implementation
    // See: https://github.com/angular/universal-starter/issues/538#issuecomment-365518693
    this.isBrowser = isPlatformBrowser(platformId);
  }

  // events
  chartClicked(e: any): void {
    // console.log(e);
  }

  chartHovered(e: any): void {
    // console.log(e);
  }
}
