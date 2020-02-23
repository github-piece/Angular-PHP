import {Component, OnInit, ViewChild} from '@angular/core';
import {first} from 'rxjs/operators';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthenticationService} from '../../_services/authentication/authentication.service';
import {UserService} from '../../_services/user/user.service';
import {MustMatch} from '../../_helpers/must-match';
import {MatDialog, MatPaginator, MatTableDataSource, PageEvent} from '@angular/material';
import {CreateModalComponent} from '../userModal/create-modal/create-modal.component';

@Component({
    selector: 'app-userpagedashboard',
    templateUrl: './userpagedashboard.component.html',
    styleUrls: ['./userpagedashboard.component.scss']
})
export class UserpagedashboardComponent implements OnInit {
    rowData: any;
    showActions = false;
    myData: any;
    onShow = false;
    registerForm: FormGroup;
    submitted = false;
    freezedflag: any;
    u_accountRadioVal: any;
    dataSource: any;
    tasks: any[];
    pageSize = 5;
    currentPage = 0;
    totalSize = 0;
    file: File = null;
    imagePath: any;
    myPhoto: any;
    uploadImageShow = false;
    @ViewChild(MatPaginator) paginator: MatPaginator;

    constructor(
        private authenticationService: AuthenticationService,
        private userService: UserService,
        private formBuilder: FormBuilder,
        private fb: FormBuilder,
        private dialog: MatDialog
    ) {}
    get f() {
        return this.registerForm.controls;
    }
    ngOnInit() {
        if (this.authenticationService.currentUserSubject.value == null) {   // if user didnt login
            this.showActions = false;
            return;
        }
        this.showActions = true;
        this.myData = this.authenticationService.currentUserSubject.value;
        this.myPhoto = this.myData.u_avatar;
        this.getFreezeFlag(this.myData.u_id);
        this.registerForm = this.formBuilder.group({
            oldPassword: ['', Validators.required],
            newPassword: ['', [Validators.required, Validators.minLength(6)]],
            confirmPassword: ['', Validators.required]
        }, {
            validator: MustMatch('newPassword', 'confirmPassword')
        });
        switch (this.myData.u_accounttype) {
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
    onChange() {
        this.onShow = !this.onShow;
    }
    onSubmit() {
        if (this.registerForm.get('oldPassword').value !== this.myData.u_password) {
            this.registerForm.controls['oldPassword'].setErrors({notMatch: true});
        } else {
            this.registerForm.controls['oldPassword'].setErrors(null);
        }
        this.submitted = true;
        if (this.registerForm.invalid) {
            return;
        }
        this.userService.changePwd(this.f.confirmPassword.value, this.myData.u_id, this.myData.u_accounttype)
            .pipe(first())
            .subscribe(
                data => {
                    this.rowData = data;
                    this.myData.u_password = this.f.confirmPassword.value;
                    this.onShow = false;
                    this.getSelect();
                });
    }
    freezeUser(userId, param: any) {
        this.userService.freezeUser(this.myData.u_id, this.myData.u_accounttype, userId, param)
            .pipe(first())
            .subscribe(
                data => {
                    this.rowData = data;
                    this.getSelect();
                },
                error => {
                });
    }
    changeRole(event, selectedId) {
        this.userService.updateUser(this.myData.u_accounttype, selectedId, event.value)
            .pipe(first())
            .subscribe(
                data => {
                    this.rowData = data;
                    this.getSelect();
                },
                error => {
                    console.log('error', error);
                });
    }
    addUser() {
        const dialogRef = this.dialog.open(CreateModalComponent, {
            width: '600px',
            autoFocus: false,
            data: {type: this.myData.u_accounttype, val: this.u_accountRadioVal, id: this.myData.u_id}
        });
        dialogRef.afterClosed().subscribe(result => {
            this.getUserList();
        });
    }
    getFreezeFlag(u_id: any) {
        this.userService.getFreezeFlag(u_id)
            .pipe(first())
            .subscribe(
                data => {
                    this.freezedflag = data.u_freezedflag;
                    this.showActions = this.freezedflag !== 1;
                });
    }
    getUserList() {
        this.userService.getUserList(this.myData.u_accounttype, this.myData.u_id)
            .pipe(first())
            .subscribe(
                data => {
                    this.rowData = data;
                    this.getSelect();
                });
    }
    getSelect() {
        let selectedRole;
        for (let i = 0; i < this.rowData.length; i++) {
            switch (this.rowData[i].u_accounttype) {
                case 'Senior Admin':
                    selectedRole = 'Senior Admin'; break;
                case 'Junior Admin':
                    selectedRole = 'Junior Admin'; break;
                case 'Moderator':
                    selectedRole = 'Moderator'; break;
                default:
                    selectedRole = 'User'; break;
            }
            this.rowData[i].selected = selectedRole;
        }
        this.getTasks();
    }
    getTasks() {
        const data = this.rowData;
        this.dataSource = new MatTableDataSource<any>(data);
        this.dataSource.paginator = this.paginator;
        this.tasks = data;
        this.totalSize = this.tasks.length;
        this.iterator();
    }
    handlePage(event?: PageEvent) {
        this.currentPage = event.pageIndex;
        this.pageSize = event.pageSize;
        this.iterator();
    }
    private iterator() {
        const end = (this.currentPage + 1) * this.pageSize;
        const start = this.currentPage * this.pageSize;
        const part = this.tasks.slice(start, end);
        this.dataSource = part;
    }
    preview(event) {
        const mimeType = event.files[0].type;
        if (mimeType.match(/image\/*/) == null) {
            return;
        }
        const reader = new FileReader();
        this.imagePath = event.files;
        reader.readAsDataURL(event.files[0]);
        reader.onload = (_event) => {
            this.myPhoto = reader.result;
        };
        this.file = event.files.item(0);
        this.uploadImageShow = true;

        const formData = new FormData();
        formData.append('userId', this.myData.u_id);
        formData.append('file', this.file);
        formData.append('action', 'upload');
        this.userService.uploadPhoto(formData)
            .pipe(first())
            .subscribe( data => {
                    this.myData = data;
                }
            );
    }
}
