import {Component} from '@angular/core';
import {map} from 'rxjs/operators';
import {Breakpoints, BreakpointObserver} from '@angular/cdk/layout';

@Component({
    selector: 'app-historydashboard',
    templateUrl: './historydashboard.component.html',
    styleUrls: ['./historydashboard.component.scss']
})
export class HistorydashboardComponent {
    /** Based on the screen size, switch from standard to one column per row */
    cards = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
        map(({matches}) => {
            if (matches) {
                return [
                    {title: 'Card 2', cols: 1, rows: 1, showhistory: false},
                    {title: 'Card 3', cols: 1, rows: 1, showhistory: false},
                    {title: 'Card 4', cols: 1, rows: 1, showhistory: false}
                ];
            }

            return [
                {title: 'Card 2', cols: 1, rows: 1, showhistory: false},
                {title: 'Card 3', cols: 1, rows: 2, showhistory: false},
                {title: 'Card 4', cols: 1, rows: 1, showhistory: false}
            ];
        })
    );

    constructor(private breakpointObserver: BreakpointObserver) {
    }
}
