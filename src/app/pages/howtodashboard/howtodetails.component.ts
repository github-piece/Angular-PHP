import {Component, Input, OnInit} from '@angular/core';
import { map} from 'rxjs/operators';
import {Breakpoints, BreakpointObserver} from '@angular/cdk/layout';
import {MatDialog} from '@angular/material';
import {AuthenticationService} from '../../_services/authentication/authentication.service';

@Component({
    selector: 'app-howtodetails',
    template: '<div *ngIf="showActions" style="padding: 24px"><img [src]="this.item.image" style="width: 100%" alt="Image">' +
        '<p>{{this.item.text}}</p><p>{{this.item.subtext}}</p><p>{{this.item.product}}</p></div>',
    styleUrls: ['./howtodashboard.component.scss']
})
export class HowtodetailsComponent implements OnInit {
    @Input() public item;
    showActions = false;
    userid: any;
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
        public dialog: MatDialog,
    ) {
        if (this.authenticationService.currentUserSubject.value == null) {   // if user didnt auth
            this.showActions = false;
        } else {

            this.showActions = true;
            this.userid = this.authenticationService.currentUserSubject.value.u_id;

        }
    }

    ngOnInit() {
        console.log(this.item);
    }
}
