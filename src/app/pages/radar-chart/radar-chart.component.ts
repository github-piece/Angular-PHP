import {Component, Input} from '@angular/core';
import { ChartDataSets, ChartType, RadialChartOptions } from 'chart.js';
import { Label } from 'ng2-charts';
import {CatalogueService} from '../../_services/catalogue/catalogue.service';
import {AuthenticationService} from '../../_services/authentication/authentication.service'
@Component({
  selector: 'app-radar-chart',
  templateUrl: './radar-chart.component.html',
  styleUrls: ['./radar-chart.component.css']
})

export class RadarChartComponent {
  userid:any;mainBusiness=[];
  scoring:any = [];
  radarChartData:any=[{
      data:[]
    }]
  radarChartOptions: RadialChartOptions = {
        responsive: true,
    };
  radarChartLabels: Label[] = ['Punctuality', 'Communication', 'Problem Solving',
        'Team Player', 'Coding', 'Technical Knowledge', 'Meeting Deadlines'];
  radarChartType: ChartType = 'radar';
    constructor(private authenticationService:AuthenticationService,
              private catalogueService:CatalogueService){
    this.userid = this.authenticationService.currentUserSubject.value.u_id;
  }
  ngOnInit() {
    this.catalogueService.getBusinessList(this.userid)
        .pipe()
        .subscribe(
            business_info => {
              //All info including answers and users.
              this.mainBusiness = business_info['mainBusiness'];
              this.mainBusiness.forEach((main_business_item,index)=>{
                  this.scoring[index] = [
                      { data: [main_business_item['resource counter'], main_business_item['opportunity counter'],
                              main_business_item['venture life cycle'],main_business_item['liability of age size'],
                              main_business_item['organisation'], main_business_item['entrepreneur'],
                              main_business_item['environment'],main_business_item['impact sector'],],
                          label: 'Scoring Chart' }
                  ];
                  this.radarChartData[index] = this.scoring[index] as any[];
                });
              }
            ,error => {
            });
        }
}

