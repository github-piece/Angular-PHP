import {Component, OnInit} from '@angular/core';
import {map} from 'rxjs/operators';
import {Breakpoints, BreakpointObserver} from '@angular/cdk/layout';
import {first} from 'rxjs/operators';
import {Router} from '@angular/router';
import {AuthenticationService} from '../../_services/authentication/authentication.service';
import {NewsfeedService} from '../../_services/newsfeed/newsfeed.service';
import {CatalogueService} from '../../_services/catalogue/catalogue.service';
import {UserService} from '../../_services/user/user.service';


@Component({
    selector: 'app-newsfeeddashboard',
    templateUrl: './newsfeeddashboard.component.html',
    styleUrls: ['./newsfeeddashboard.component.scss']
})
export class NewsfeeddashboardComponent implements OnInit {
    /** Based on the screen size, switch from standard to one column per row */

    public doughnutChartLabels = ['Agriculture', 'Industrial', 'Resources'];
    public doughnutChartData = [0, 0, 0];
    public doughnutChartType = 'doughnut';

    cards = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
        map(({matches}) => {
            if (matches) {
                return [
                    {title: 'Newsfeed', cols: 3, rows: 1, showchart: false},
                    {title: 'Market News', cols: 2, rows: 1, showchart: false},
                    {title: 'Website Audience', cols: 1, rows: 1, showchart: true},
                    {title: 'Market Split', cols: 2, rows: 1, showchart: true},
                    {title: 'Website Audience', cols: 1, rows: 1, showchart: true},
                ];
            }

            return [
                {title: 'Newsfeed', cols: 3, rows: 1, showchart: false, showoption: 'admin_table'},
                {title: 'Market News', cols: 2, rows: 1, showchart: false, showoption: 'user_table'},
                {title: 'Website Audience', cols: 1, rows: 1, showchart: true, showoption: 'chart1'},
                {title: 'Market Split', cols: 2, rows: 1, showchart: false, showoption: ''},
                {title: 'Website Audience', cols: 1, rows: 1, showchart: true, showoption: 'chart2'},
            ];

        })
    );

    displayedColumns: string[] = ['no', 'u_name', 'headline', 'article_createdate'];
    rowData = [];
    rowData_admin = []; // datas for userlist
    rowData_user = [];  // datas for userlist

    showActions = false;
    u_accounttype: any;
    u_id: any;
    freezedflag: any;
    private rowSelection;

    constructor(private breakpointObserver: BreakpointObserver,
                private authenticationService: AuthenticationService,
                private newsfeedService: NewsfeedService,
                private router: Router,
                private catalogueService: CatalogueService,
                private userService: UserService) {
    }

    ngOnInit() {
        if (this.authenticationService.currentUserSubject.value == null) {   // if user didnt auth
            this.showActions = false;
            return;
        } else {
            this.showActions = true;
        }

        this.u_id = this.authenticationService.currentUserSubject.value.u_id;
        this.u_accounttype = this.authenticationService.currentUserSubject.value.u_accounttype;
        this.getFreezeFlag(this.u_id);
        this.rowSelection = 'single';

        this.catalogueService.getBusinessList(this.u_id)
            .pipe(first())
            .subscribe(
                data => {
                    this.rowData = data['users'];

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

        this.u_accounttype = this.authenticationService.currentUserSubject.value.u_accounttype;
        this.getArticleList();
        this.getArticleList_Admin();
        this.getArticleList_User();

    }

    getArticleList() {
        this.newsfeedService.getArticleList(this.u_accounttype, this.u_id)
            .pipe(first())
            .subscribe(
                data => {
                    this.rowData = data;
                    // console.log("rowdata", this.rowData);
                },
                error => {
                    console.log('error', error);
                });
    }

    getArticleList_Admin() {
        this.newsfeedService.getArticleList_Admin(this.u_accounttype, this.u_id)
            .pipe(first())
            .subscribe(
                data => {
                    this.rowData_admin = data;
                    // console.log("rowdata", this.rowData);
                },
                error => {
                    console.log('error', error);
                });
    }

    getArticleList_User() {
        this.newsfeedService.getArticleList_User(this.u_accounttype, this.u_id)
            .pipe(first())
            .subscribe(
                data => {
                    this.rowData_user = data;
                    // console.log("rowdata", this.rowData);
                },
                error => {
                    console.log('error', error);
                });
    }

    getFreezeFlag(u_id: any) {
        this.userService.getFreezeFlag(u_id)
            .pipe(first())
            .subscribe(
                data => {
                    console.log(data);
                    this.freezedflag = data.u_freezedflag;
                    if (this.freezedflag === 1) {
                        this.showActions = false;
                    } else {
                        this.showActions = true;
                    }

                    // console.log("rowdata", this.rowData);
                },
                error => {
                    console.log('error', error);
                });
    }

    onSelectionChanged(event: any) {
        this.router.navigate(['pages/detailArticle'], {
            queryParams: {
                selectArticleid: event.id,
                articleUsertype: 'admin'
            }
        });
    }

    onSelectionAdminChanged(event: any) {
        this.router.navigate(['pages/detailArticle'], {
            queryParams: {
                selectArticleid: event.id,
                articleUsertype: 'admin'
            }
        });
    }

    onSelectionUserChanged(event: any) {
        this.router.navigate(['pages/detailArticle'], {
            queryParams: {
                selectArticleid: event.id,
                articleUsertype: 'user'
            }
        });
    }
}
