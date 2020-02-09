import {Component, OnInit, AfterViewInit} from '@angular/core';
import {map} from 'rxjs/operators';
import {Breakpoints, BreakpointObserver} from '@angular/cdk/layout';
import {first} from 'rxjs/operators';
import {Router, ActivatedRoute} from '@angular/router';
import {AuthenticationService} from '../../_services/authentication/authentication.service';
import {CatalogueService} from '../../_services/catalogue/catalogue.service';
import {NewsfeedService} from '../../_services/newsfeed/newsfeed.service';
import {UserService} from '../../_services/user/user.service';
import {BusinessServiceService} from '../../_services/business/business-service.service';
import {AuthService} from 'angularx-social-login';


@Component({
    selector: 'app-maindashboard',
    templateUrl: './maindashboard.component.html',
    styleUrls: ['./maindashboard.component.scss']
})

export class MaindashboardComponent implements OnInit, AfterViewInit {

    public pieChartType = 'pie';
    public pieChartLabels = ['Agriculture', 'Industrial', 'Resources'];
    public pieChartData = [0, 0, 0];
    public pieChartColors = ['#bd0fe1', '#f6a623', '#b8e986'];

    lat: any;
    lng: any;

    zoom = 2;
    address = '';
    /** Based on the screen size, switch from standard to one column per row */
    showActions = false;
    userid: any;
    rowData = [];
    columnDefs = [
        {headerName: 'No', field: 'id', width: 50},
        {headerName: 'Business Name', field: 'b_name', width: 350},
        {headerName: 'Business Location', field: 'b_location', width: 320},
        {headerName: 'Business Address', field: 'b_address', width: 350}
    ];
    columnDefs_admin = [
        {headerName: 'No', field: 'no', width: 50},
        {headerName: 'User Name', field: 'u_name', width: 300},
        {headerName: 'Headline', field: 'headline', width: 350},
        {headerName: 'Created Date', field: 'article_createdate', width: 300}
    ];
    columnDefs_user = [
        {headerName: 'No', field: 'no', width: 50},
        {headerName: 'User Name', field: 'u_name', width: 100},
        {headerName: 'Headline', field: 'headline', width: 250},
        {headerName: 'Created Date', field: 'article_createdate', width: 150}
    ];
    public doughnutChartLabels = ['Users Q1', 'Sales Q2', 'Registers Q3', 'Sales Q4'];
    public doughnutChartData = [120, 150, 180, 90];
    public doughnutChartType = 'doughnut';
    cards = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
        map(({matches}) => {
            if (matches) {
                return [
                    {title: 'Your World, Today', cols: 3, rows: 2, showchart: false, showmap: true},
                    {title: 'Newsfeed', cols: 1, rows: 1, showchart: false, showmap: false},
                    {title: 'Website Audience', cols: 1, rows: 1, showchart: true, showmap: false},
                    {title: 'Market Splite', cols: 1, rows: 1, showchart: true, showmap: false}
                ];
            }

            return [
                {title: 'Your World, Today', cols: 3, rows: 2, showchart: false, showmap: true, showoption: ''},
                {title: 'Admin Users', cols: 1, rows: 1, showchart: false, showmap: false, showoption: 'admin_table'},
                {title: 'Users', cols: 1, rows: 1, showchart: false, showmap: false, showoption: 'user_table'},
                {title: 'Website Audience', cols: 1, rows: 1, showchart: true, showmap: false, showoption: ''}
            ];
        })
    );

    tableDisplayedColumns: string[] = ['name', 'status'];
    tableDataSource = undefined;
    columsDisplay: string[] = ['no', 'b_name', 'b_location', 'b_address'];
    displayedColumns_admin: string[] = ['no', 'u_name', 'headline'];
    displayedColumns_user: string[] = ['no', 'u_name', 'headline'];
    rowData_admin = undefined;  // datas for userlist
    rowData_user = [];  // datas for userlist
    u_accounttype: any;
    u_id: any;
    freezedflag: any;
    private rowSelection;

    constructor(
        private breakpointObserver: BreakpointObserver,
        private authenticationService: AuthenticationService,
        private catalogueService: CatalogueService,
        private newsfeedService: NewsfeedService,
        private userService: UserService,
        private route: ActivatedRoute,
        private router: Router,
        private businessService: BusinessServiceService,
        private authService: AuthService
    ) {


    }

    ngOnInit() {
        // this.tableDataSource = [{
        //     'picture': 'asdf', 'name': 'asdf', 'status': 'asdf', 'progress': 'asdf', 'comments': 'asdf', 'policy': 'asdf'
        // }];

        // this.rowData_admin = [{'id':'asdf','u_name':"asdf",'headline':"asdf"}];

        if (this.authenticationService.currentUserSubject.value == null) {
            this.showActions = false;
        } else {
            this.showActions = true;
            this.userid = this.authenticationService.currentUserSubject.value.u_id;
            this.viewMap();
            this.u_id = this.authenticationService.currentUserSubject.value.u_id;
            this.u_accounttype = this.authenticationService.currentUserSubject.value.u_accounttype;
            this.getFreezeFlag(this.u_id);
            this.rowSelection = 'single';

            this.getArticleList_Admin();
            this.getArticleList_User();
            this.catalogueService.getBusinessList(this.userid)
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
                        this.pieChartData = [agriculture_count, industrial_count, resources_count];
                    },
                    error => {
                    });
        }
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
                },
                error => {
                    console.log('error', error);
                });
    }

    ngAfterViewInit() {
        //  this.getPlaceAutocomplete();
    }

    viewMap() {
        console.log('address', this.address);
        this.businessService.getGeometry(this.address)
            .pipe(first())
            .subscribe(
                data => {
                    this.lat = 37.0551565;
                    this.lng = -95.6726939;
                },
                error => {
                });
    }


    onSelectionAdminChanged(event: any) {
        console.log(event.id);
        this.router.navigate(['pages/detailArticle'], {
            queryParams: {
                selectArticleid: event.id,
                articleUsertype: 'admin'
            }
        });
        // this.router.navigate(['detailArticle'], {
        //     queryParams: {
        //         selectArticleid: event.api.getSelectedRows()[0].id,
        //         articleUsertype: 'admin'
        //     }
        // });
    }

    onSelectionUserChanged(event: any) {
        this.router.navigate(['pages/detailArticle'], {
            queryParams: {
                selectArticleid: event.api.getSelectedRows()[0].id,
                articleUsertype: 'user'
            }
        });
    }

}
