import {Component, OnInit, AfterViewInit, Input} from '@angular/core';
import {map} from 'rxjs/operators';
import {Breakpoints, BreakpointObserver} from '@angular/cdk/layout';
import {first} from 'rxjs/operators';
import {Router, ActivatedRoute} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthenticationService} from '../../_services/authentication/authentication.service';
import {CatalogueService} from '../../_services/catalogue/catalogue.service';
import {NewsfeedService} from '../../_services/newsfeed/newsfeed.service';
import {UserService} from '../../_services/user/user.service';
import {ContactService} from '../../_services/contact/contact-service.service';



@Component({
    selector: 'app-contactusdashboard',
    templateUrl: './contactusdashboard.component.html',
    styleUrls: ['./contactusdashboard.component.scss']
})

export class ContactusdashboardComponent implements OnInit, AfterViewInit {

    contactForm: FormGroup;
    submitted = false;

    userData: any;
    lat: any;
    lng: any;
    mapId = 'roadmap';

    zoom = 5;
    address = '';
    showActions = false;
    userid: any;
    rowData = [];
    loading: boolean;
    cards = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
        map(({matches}) => {
            if (matches) {
                return [
                    {title: 'Card 1', cols: 2, rows: 1, showchart: false, showmap: true},
                    {title: 'Card 2', cols: 1, rows: 1, showchart: false, showmap: false},
                ];
            }

            return [
                {title: 'Card 1', cols: 1, rows: 1, showchart: false, showmap: true, showoption: ''},
                {title: 'Card 2', cols: 1, rows: 1, showchart: false, showmap: false, showoption: 'admin_table'},
            ];
        })
    );

    tableDataSource = undefined;
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
        private contactService: ContactService,
        private formBuilder: FormBuilder,
    ) {


    }

    ngOnInit() {
        this.tableDataSource = [{
            'picture': 'asdf', 'name': 'asdf', 'status': 'asdf', 'progress': 'asdf', 'comments': 'asdf', 'policy': 'asdf'
        }];
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
        }
        this.loading = false;
        this.initializeFormValidator();
        this.userData = {
            name: '',
            email: '',
            phone_number: '',
            message: '',
        };
    }
    initializeFormValidator() {
        this.contactForm = this.formBuilder.group({
            name: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            phone_number: ['', Validators.required],
            message: ['', Validators.required]
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
                    console.log('rowData_user');
                    console.log(data);
                },
                error => {
                    console.log('error', error);
                });
    }
    get f() {
        return this.contactForm.controls;
    }

    ngAfterViewInit() {
    }

    viewMap() {
        console.log('address', this.address);
        this.contactService.getGeometry(this.address)
            .pipe(first())
            .subscribe(
                data => {
                    this.lat = 47.7511;
                    this.lng = -120.740135;
                },
                error => {
                });
    }
    submit() {
        console.log(this.contactForm.value);
        this.submitted = true;
        if (this.contactForm.invalid) {
            return;
        }
    }
}
