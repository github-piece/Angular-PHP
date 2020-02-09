import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {first, map} from 'rxjs/operators';
import {Breakpoints, BreakpointObserver} from '@angular/cdk/layout';
import {MatDialog} from '@angular/material';
import {HowtodetailsComponent} from './howtodetails.component';
import {AuthenticationService} from '../../_services/authentication/authentication.service';
import {CatalogueService} from '../../_services/catalogue/catalogue.service';
import {HowtoService} from '../../_services/howto/howto.service';

@Component({
    selector: 'app-howtodashboard',
    templateUrl: './howtodashboard.component.html',
    styleUrls: ['./howtodashboard.component.scss']
})
export class HowtodashboardComponent implements OnInit {
    showActions = false;
    loading: boolean;
    imgList: any;
    userid: any;
    imgUrl: any;
    @Input() user;
    /** Based on the screen size, switch from standard to one column per row */
    cards = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
        map(({matches}) => {
            if (matches) {
                return [
                    {title: 'Invest in a business', cols: 1, rows: 1},
                    {title: 'Provide business support', cols: 1, rows: 1},
                    {title: 'Use the insights to write articles about businesses and sustainability', cols: 1, rows: 1},
                    {title: 'Develop a questionnaire and help people understand your communities economy', cols: 1, rows: 1}
                ];
            }

            return [
                {title: 'Invest in a  business', cols: 1, rows: 1},
                {title: 'Provide business support', cols: 1, rows: 1},
                {title: 'Use the insights to write articles about businesses and sustainability', cols: 1, rows: 1},
                {title: 'Develop a questionnaire and help people understand your communities economy', cols: 1, rows: 1}
            ];
        })
    );

    constructor(
        private breakpointObserver: BreakpointObserver,
        private authenticationService: AuthenticationService,
        private catalogueService: CatalogueService,
        public dialog: MatDialog,
        private el: ElementRef,
        private dataService: HowtoService,
    ) {
        if (this.authenticationService.currentUserSubject.value == null) {   // if user didnt auth
            this.showActions = false;
        } else {

            this.showActions = true;
            this.userid = this.authenticationService.currentUserSubject.value.u_id;
            this.getBusinessList();

        }
    }

    ngOnInit() {
        this.imgList = [];
        this.getBusinessList();
    }

    getBusinessList() {
        this.dataService.getBanners().then(snapshot => {
            this.imgList = [];
            this.imgList = snapshot;
            console.log(this.imgList);
            this.imgList.push();
        });
    }
    detailShow(service) {
        const dialogRef = this.dialog.open(HowtodetailsComponent);
        dialogRef.componentInstance.item = service;
    }
}
