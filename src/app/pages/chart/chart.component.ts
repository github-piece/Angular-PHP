import { Component, OnInit } from '@angular/core';
import {CatalogueService} from '../../_services/catalogue/catalogue.service';
import {AuthenticationService} from '../../_services/authentication/authentication.service';
import {ChartService} from '../../_services/chart/chart.service';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnInit {
  public pieChartType = 'pie';
  public pieChartLabels: any;
  public pieChartData: any;

  userid: any;

  // events
  public chartClicked(e: any): void {
    console.log(e);
  }

  public chartHovered(e: any): void {
    console.log(e);
  }


  constructor(private catalogueService: CatalogueService, private authenticationService: AuthenticationService, private chartService: ChartService) { }

  ngOnInit() {
      console.log('chartcomponet', this.chartService.pieChartData);
      this.userid = this.authenticationService.currentUserSubject.value.u_id;
      this.pieChartLabels = this.chartService.pieChartLabels;
      this.pieChartData = this.chartService.pieChartData;

    }
}
