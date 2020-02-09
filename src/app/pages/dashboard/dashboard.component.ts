import {Component, ViewEncapsulation, Inject, PLATFORM_ID, OnInit} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { APP_BASE_HREF, isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard.component.html',
  styleUrls: [
    './styles/dashboard.scss',
    '../../layouts/pages/lists/styles/lists.scss',
    '../../layouts/pages/tabs/styles/tabs.scss',
    '../../common/charts/pages/ng2-charts/styles/ng2-charts.scss',
    '../../tables/pages/extended/styles/_extended-tables.scss'
  ],
  encapsulation: ViewEncapsulation.None
})

export class DashboardPageComponent implements OnInit {
  charts: any = {};
  orders = [
    { title: 'Completed Orders', day: 35, week: 120, month: 499 },
    { title: 'Abandoned Carts', day: 4, week: 21, month: 115 },
    { title: 'New Accounts', day: 15, week: 100, month: 340 },
    { title: 'New Leads', day: 55, week: 201, month: 789 },
    { title: '% of NL that made purchase', day: '10%', week: '11%', month: '9%' },
    { title: 'Unsubscribed customers', day: 2, week: 10, month: 43 }
  ];
  tableDisplayedColumns: string[] = ['picture', 'name', 'status', 'progress', 'comments', 'policy'];
  tableDataSource = undefined;
  tableDataSourceTemp = [];
  baseUrl = '';
  isBrowser: boolean;

  constructor(
    route: ActivatedRoute,
    @Inject(APP_BASE_HREF) private baseHref: string,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    // <canvas> element is not yet supported by the SSR DOM implementation
    // See: https://github.com/angular/universal-starter/issues/538#issuecomment-365518693
    this.isBrowser = isPlatformBrowser(platformId);

    this.charts = route.snapshot.data['chart'];
    this.charts.lineChart.options.maintainAspectRatio = false;
    this.charts.doughnutChart.options.maintainAspectRatio = false;
    this.baseUrl = baseHref;
    this.tableDataSourceTemp = route.snapshot.data['table'].data;
  }

  ngOnInit() {
    this.tableDataSource = this.tableDataSourceTemp;
  }
}
