import {Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ChartService {

    constructor() {
    }

    public pieChartType = 'pie';
    public pieChartLabels = ['', '', ''];
    public pieChartData = [0, 0, 0];

    // events
    public chartClicked(e: any): void {
        console.log(e);
    }

    public chartHovered(e: any): void {
        console.log(e);
    }


}
