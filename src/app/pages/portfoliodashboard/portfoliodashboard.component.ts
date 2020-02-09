import {Component, OnInit} from '@angular/core';
import {map} from 'rxjs/operators';
import {Breakpoints, BreakpointObserver} from '@angular/cdk/layout';
import {first} from 'rxjs/operators';
import {MatDialog} from '@angular/material';
import {BuysellService} from '../../_services/buysell/buysell.service';
import {AuthenticationService} from '../../_services/authentication/authentication.service';
import {CatalogueService} from '../../_services/catalogue/catalogue.service';
import {ModalComponent} from '../modal/modal.component';

@Component({
    selector: 'app-portfoliodashboard',
    templateUrl: './portfoliodashboard.component.html',
    styleUrls: ['./portfoliodashboard.component.scss']
})
export class PortfoliodashboardComponent implements OnInit {
    /** Based on the screen size, switch from standard to one column per row */

    public pieChartLabels1 = [];
    public pieChartData1 = [0, 0, 0];
    public business_id: any;
    rowData: any = [];
    private rowSelection;
    public doughnutChartLabels = ['Agriculture', 'Industrial', 'Resources'];
    public doughnutChartData = [0, 0, 0];
    public doughnutChartType = 'doughnut';
    displayedColumns: string[] = ['no', 'b_name', 'b_location', 'b_address', 'amount'];
    cards = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
        map(({matches}) => {
            if (matches) {
                return [
                    {title: 'Card 2', cols: 1, rows: 1, showchart: true, showchart1: false},
                    {title: 'Card 3', cols: 1, rows: 1, showchart: false, showchart1: true},
                    {title: 'Card 4', cols: 1, rows: 1, showchart: false, showchart1: false}
                ];
            }

            return [
                {title: 'Card 2', cols: 1, rows: 1, showchart: true, showchart1: false},
                {title: 'Card 3', cols: 1, rows: 2, showchart: false, showchart1: true},
                {title: 'Card 4', cols: 1, rows: 1, showchart: false, showchart1: false}
            ];
        })
    );
    showActions = false;
    userid: any;

    showbutton = false;

    constructor(private breakpointObserver: BreakpointObserver,
                private buysellService: BuysellService,
                private authenticationService: AuthenticationService,
                private catalogueService: CatalogueService,
                public dialog: MatDialog) {
    }

    ngOnInit() {
        this.rowSelection = 'single';

        if (this.authenticationService.currentUserSubject.value == null) {
            this.showActions = false;
        } else {
            this.showActions = true;
            this.userid = this.authenticationService.currentUserSubject.value.u_id;
            // for loaind chart on card 2.....
            this.catalogueService.getBusinessList(this.userid)
                .pipe(first())
                .subscribe(
                    data => {

                        let agriculture_count = 0;
                        let industrial_count = 0;
                        let resources_count = 0;

                        for (let i = 0; i < data.length; i++) {
                            if (data[i].b_companysectorval === 1) {
                                agriculture_count++;
                            }
                            if (data[i].b_companysectorval === 2) {
                                industrial_count++;
                            }
                            if (data[i].b_companysectorval === 3) {
                                resources_count++;
                            }

                        }
                        this.doughnutChartData = [agriculture_count, industrial_count, resources_count];

                    },
                    error => {
                    });

            // for loaind chart on card 3.....
            this.catalogueService.getDataForChart(this.userid)
                .pipe(first())
                .subscribe(
                    data => {
                        const agriculture_count = 0;
                        const industrial_count = 0;
                        const resources_count = 0;

                        for (let i = 0; i < data.length; i++) {
                            this.pieChartData1[i] = data[i].b_count;
                            this.pieChartLabels1[i] = data[i].b_country;
                        }
                        console.log(this.pieChartData1);
                        //   this.pieChartData = [agriculture_count, industrial_count, resources_count];
                    },
                    error => {
                    });

            this.buysellService.getPortfolio(this.userid)
                .pipe(first())
                .subscribe(
                    data => {
                        this.buysellService.rowData = data;
                        this.rowData = this.buysellService.rowData;
                    },
                    error => {
                    });
        }
    }

    buy() {
        this.buysellService.business_id = this.business_id;
        this.buysellService.modal_content = 'Are you going to buy this item?';
        this.buysellService.action = 'buy';
        this.openDialog();
    }

    sell() {
        this.buysellService.business_id = this.business_id;
        this.buysellService.modal_content = 'Are you going to sell this item?';
        this.buysellService.action = 'sell';
        this.openDialog();
    }

    openDialog(): void {
        const dialogRef = this.dialog.open(ModalComponent, {
            width: '350px'

        });

        dialogRef.afterClosed().subscribe(result => {
            this.rowData = this.buysellService.rowData;
            console.log(this.buysellService.rowData);


        });
    }

    onSelectionChanged(event: any) {
        this.business_id = event.business_id;
        this.showbutton = true;
    }
}
