import {Component, OnInit} from '@angular/core';
import {map} from 'rxjs/operators';
import {Breakpoints, BreakpointObserver} from '@angular/cdk/layout';
import {first} from 'rxjs/operators';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthenticationService} from '../../_services/authentication/authentication.service';
import {UserService} from '../../_services/user/user.service';
import {MustMatch} from '../../_helpers/must-match';

@Component({
    selector: 'app-userpagedashboard',
    templateUrl: './userpagedashboard.component.html',
    styleUrls: ['./userpagedashboard.component.scss']
})
export class UserpagedashboardComponent implements OnInit {
    /** Based on the screen size, switch from standard to one column per row */
    cards = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
        map(({matches}) => {
            if (matches) {
                return [
                    // { title: 'Card 1', cols: 1, rows: 1, showoption:"listuser" },
                    {title: 'Account Information', cols: 1, rows: 1, showoption: 'userinfo'},
                    {title: 'Card 3', cols: 1, rows: 1, showoption: 'adduser'},
                    {title: 'Card 4', cols: 1, rows: 1, showoption: ''}
                ];
            }

            return [
                // { title: 'Card 1', cols: 2, rows: 1, showoption:"listuser"},
                {title: 'Add user to your organization', cols: 1, rows: 2, showoption: 'adduser'},
                {title: 'Account Information', cols: 1, rows: 2, showoption: 'userinfo'}
                // { title: 'Card 4', cols: 1, rows: 1, showoption:"" }
            ];
        })
    );
    displayedColumns: string[] = ['no', 'u_name', 'u_email', 'u_createddate', 'u_active'];
    rowData = [];  // datas for userlist
    columnDefs = [
        {headerName: 'No', field: 'no', width: 50},
        {headerName: 'User Name', field: 'u_name', width: 300},
        {headerName: 'User Email', field: 'u_email', width: 300},
        {headerName: 'Created Date', field: 'u_createddate', width: 250},
        {headerName: 'Active / Inactive', field: 'u_active', width: 170}

    ];
    private rowSelection;
    registerForm: FormGroup;
    addUserForm: FormGroup;
    showActions = false;

    u_accounttype: any;
    u_id: any;
    u_name: any;
    u_email: any;
    u_createddate: any;
    u_password: any;

    seleted_uid: any;
    seleted_uname: any;
    seleted_uemail: any;
    seleted_udate: any;
    freezedflag: any;

    seleted_active: any;
    btn_showActive = false;
    btn_showInActive = false;
    showAdduserCard = false;

    showUpdateUser = false;

    submitted = false;
    submitted_adduser = false;
    noMatcheOldpwd = false;
    changePwdloading = false;
    updateUserloading = false;
    createUserloading = false;

    radio_accounttype: string;
    accouttypelist: string[] = ['User', 'Senior Admin', 'Junior Admin'];

    u_accountRadioVal: any;

    constructor(private breakpointObserver: BreakpointObserver,
                private authenticationService: AuthenticationService,
                private userService: UserService,
                private formBuilder: FormBuilder
    ) {
    }

    get f() {
        return this.registerForm.controls;
    }

    get f_adduser() {
        return this.addUserForm.controls;
    }

    ngOnInit() {
        console.log('this.authenticationService.currentUserSubject.value', this.authenticationService.currentUserSubject.value);

        if (this.authenticationService.currentUserSubject.value == null) {   // if user didnt login
            this.showActions = false;
            return;
        }

        this.showActions = true;

        this.u_id = this.authenticationService.currentUserSubject.value.u_id;
        this.u_name = this.authenticationService.currentUserSubject.value.u_name;
        this.u_email = this.authenticationService.currentUserSubject.value.u_email;
        this.u_createddate = this.authenticationService.currentUserSubject.value.u_createddate;
        this.u_password = this.authenticationService.currentUserSubject.value.u_password;

        this.getFreezeFlag(this.u_id);

        // change password form initialize
        this.registerForm = this.formBuilder.group({
                old_password: ['', [Validators.required, Validators.minLength(6)]],
                new_password: ['', [Validators.required, Validators.minLength(6)]],
                confirm_password: ['', Validators.required]
            },
            {
                validator: MustMatch('new_password', 'confirm_password'),

            }
        );

        // add user form initialize
        this.addUserForm = this.formBuilder.group({
                u_addname: ['', Validators.required],
                u_addemail: ['', [Validators.required, Validators.email]],
                u_addpassword: ['', [Validators.required, Validators.minLength(6)]],
                u_addconfirmpassword: ['', Validators.required]
            },
            {
                validator: MustMatch('u_addpassword', 'u_addconfirmpassword'),

            }
        );
        this.rowSelection = 'single';

        this.u_accounttype = this.authenticationService.currentUserSubject.value.u_accounttype;
        switch (this.u_accounttype) {
            case 'Super Admin':
                this.u_accountRadioVal = 'Senior Admin';
                break;
            case 'Senior Admin':
                this.u_accountRadioVal = 'Junior Admin';
                break;

            case 'Junior Admin':
                this.u_accountRadioVal = 'User';
                break;
            case 'Moderator':
                this.u_accountRadioVal = 'User';
                break;
        }

        this.getUserList();

    }

    getFreezeFlag(u_id: any) {
        this.userService.getFreezeFlag( u_id)
            .pipe(first())
            .subscribe(
                data => {
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

    getUserList() {
        this.userService.getUserList(this.u_accounttype, this.u_id)
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

    onSelectionChanged(event: any) {
        this.showAdduserCard = true;
        this.showUpdateUser = true;  // if i select row on userlist table we will see update user button.

        this.seleted_uid = event.u_id;
        this.seleted_uname = event.u_name;
        this.seleted_uemail = event.u_email;
        this.seleted_udate = event.u_createddate;
        this.seleted_active = event.u_freezedflag;
        console.log(this.seleted_active);
        if (this.seleted_active === 0) {   // if selected user is active
            this.btn_showActive = true;
            this.btn_showInActive = false;
        } else {
            this.btn_showInActive = true;
            this.btn_showActive = false;
        }
    }

    freezeUser(param: any) {
        console.log(param);

        this.userService.freezeUser(this.u_id, this.u_accounttype, this.seleted_uid, param)
            .pipe(first())
            .subscribe(
                data => {
                    this.rowData = data;
                    if (param === 'active') {
                        this.btn_showActive = true;
                        this.btn_showInActive = false;
                    } else {
                        this.btn_showInActive = true;
                        this.btn_showActive = false;

                    }
                    console.log('rowdata', this.rowData);
                },
                error => {
                    console.log('error', error);
                });
    }

    createUser() {
        this.submitted_adduser = true;
        if (this.addUserForm.invalid) {
            this.createUserloading = false;
            return;
        }
        this.createUserloading = true;

        const username = this.f_adduser.u_addname.value;
        const u_email = this.f_adduser.u_addemail.value;
        const u_pwd = this.f_adduser.u_addconfirmpassword.value;
        this.userService.createUser(username, u_email, u_pwd, this.u_accounttype, this.u_accountRadioVal, this.u_id)
            .pipe(first())
            .subscribe(
                data => {
                    this.rowData = data;
                    setTimeout(() => {
                        this.createUserloading = false;
                    }, 1500);

                },
                error => {
                    console.log('error', error);
                });
    }

    updateUser() {
        this.updateUserloading = true;
        this.userService.updateUser(this.u_accounttype, this.seleted_uid, this.u_accountRadioVal)
            .pipe(first())
            .subscribe(
                data => {
                    this.rowData = data;
                    setTimeout(() => {
                        this.updateUserloading = false;
                    }, 1500);

                },
                error => {
                    console.log('error', error);
                });
    }

    changePwd() {
        this.changePwdloading = true;

        this.submitted = true;
        if (this.u_password !== this.f.old_password.value) {
            this.noMatcheOldpwd = true;
            this.changePwdloading = false;

            return;
        }
        if (this.registerForm.invalid) {
            this.changePwdloading = false;
            return;
        }

        this.userService.changePwd(this.f.confirm_password.value, this.u_id, this.u_accounttype)
            .pipe(first())
            .subscribe(
                data => {
                    this.rowData = data;

                    setTimeout(() => {
                        this.changePwdloading = false;
                    }, 1500);
                },
                error => {
                });

        console.log(this.registerForm.invalid);
    }

    oldPwdChanged() {
        if (this.u_password === this.f.old_password.value) {
            this.noMatcheOldpwd = false;
        } else {
            this.noMatcheOldpwd = true;
        }
    }
}
