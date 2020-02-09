import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material';
import {AboutDetailsComponent} from './aboutdetails/aboutusdetails.component';
import {first, map} from 'rxjs/operators';
import {ImageCroppedEvent, ImageCropperComponent} from 'ngx-image-cropper';
import {AuthenticationService} from '../../_services/authentication/authentication.service';
import {AboutusService} from '../../_services/aboutus/aboutus.service';
import {AlertService} from '../../_services/common/alert.service';
import {UserService} from '../../_services/user/user.service';

@Component({
    selector: 'app-aboutusdashboard',
    templateUrl: './aboutusdashboard.component.html',
    styleUrls: ['./aboutusdashboard.component.scss']
})
export class AboutusdashboardComponent implements OnInit {
    step = 0;

    setStep(index: number) {
        this.step = index;
    }

    nextStep() {
        this.step++;
    }

    prevStep() {
        this.step--;
    }
    @ViewChild(ImageCropperComponent) imageCropper: ImageCropperComponent;
    @ViewChild('fileInput') fileInput: ElementRef;
    @Input() aboutForm: FormGroup;
    imageChangedEvent: any;
    croppedImage: any;
    imageSelected: boolean;
    imageChanged: boolean;
    showCropper = false;
    @Input() user;
    /** Based on the screen size, switch from standard to one column per row */
    cards = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
        map(({matches}) => {
            if (matches) {
                return [
                    {title: 'Card 1', cols: 1, rows: 1},
                ];
            }

            return [
                {title: 'Card 1', cols: 2, rows: 1, showoption: 'section1'},
            ];
        })
    );
    displayedColumns: string[] = ['no', 'headline', 'article_createdate', 'u_accounttype'];
    rowData = [];  // datas for userlist

    showActions = false;
    showCrud = false;
    submitted = false;
    action: any = 'add';

    u_id: any;
    u_parentid: any;
    u_imgurl: any;

    u_accounttype: any;
    freezedflag: any;
    imgurl: any;
    articleloading = false;
    showDeleteBtn = false;
    showUnselectBtn = false;
    public message: string;
    private rowSelection;
    rowselect_id: any;
    centered: false;
    disabled: false;
    unbounded: false;
    radius: number;
    color: '#ccc';

    /** Based on the screen size, switch from standard to one column per row */

    constructor(
        private breakpointObserver: BreakpointObserver,
        private authenticationService: AuthenticationService,
        private aboutService: AboutusService,
        private formBuilder: FormBuilder,
        private alertService: AlertService,
        private router: Router,
        private route: ActivatedRoute,
        private dialog: MatDialog,
        private userService: UserService,
    ) {
    }

    ngOnInit(): void {
        if (this.authenticationService.currentUserSubject.value == null) {   // if user didnt login
            this.showActions = false;
            return;
        } else {
            this.showActions = true;
        }
        this.u_parentid = this.authenticationService.currentUserSubject.value.u_parentid;
        this.u_accounttype = this.authenticationService.currentUserSubject.value.u_accounttype;

        this.showCrud = this.u_accounttype === 'Super Admin';
        this.getFreezeFlag(this.u_id);
        this.rowSelection = 'single';

        this.aboutForm = this.formBuilder.group({
            headline: ['', Validators.required],
            section1: ['', Validators.required],
            section2: ['', Validators.required],
            imgurl: [''],
            file1: [''],
            file2: ['']
        });
        this.getArticleList();
        this.showActions = true;
        this.imageChanged = false;
        this.imageSelected = false;
        this.croppedImage = '../../assets/imgs/avatar.png';
        this.rowData = [];
    }

    getArticleList() {
        const formData = new FormData();

        formData.append('u_id', this.u_id);
        formData.append('u_parentid', this.u_parentid);
        formData.append('imgurl', this.imgurl);
        formData.append('u_accounttype', this.u_accounttype);
        formData.append('action', 'get');

        this.aboutService.getArticleList(formData)
            .pipe(first())
            .subscribe(
                data => {
                    this.rowData = data;
                    console.log(this.rowData);
                    console.log(this.u_accounttype);

                    // console.log("rowdata", this.rowData);
                },
                error => {
                    console.log('error', error);
                });
    }

    get f() {
        return this.aboutForm.controls;
    }

    chooseImage() {
        this.fileInput.nativeElement.click();
    }

    fileChangeEvent(event: any): void {
        if (event.srcElement.files.length > 0) {
            this.imageSelected = true;
            this.imageChangedEvent = event;
        }
    }

    imageCropped(event: ImageCroppedEvent) {
        this.croppedImage = event.base64;
        console.log(this.croppedImage);
    }

    imageLoaded() {
        this.showCropper = true;
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

    submitArticle() {
        // this.duplicate = true;
        // stop here if form is invalid
        this.submitted = true;
        if (this.aboutForm.invalid) {
            return;
        }

        this.articleloading = true;

        if (this.aboutForm.valid) {
            const formData = new FormData();
            this.imgurl = this.croppedImage;
            formData.append('u_id', this.u_id);
            formData.append('u_parentid', this.u_parentid);
            formData.append('u_accounttype', this.u_accounttype);
            formData.append('action', this.action);
            formData.append('id', this.rowselect_id);

            formData.append('imgurl', this.imgurl);
            formData.append('section1', this.aboutForm.get('section1').value);
            formData.append('section2', this.aboutForm.get('section2').value);
            formData.append('section2', this.aboutForm.get('section2').value);
            formData.append('headline', this.aboutForm.get('headline').value);
            console.log(formData);
            this.aboutService.articleSubmit(formData)
                .pipe(first())
                .subscribe(
                    data => {
                        this.rowData = data;
                        setTimeout(() => {
                            this.articleloading = false;
                        }, 1500);

                    },
                    error => {
                        console.log('error', error);
                    });
        }
    }

    unselectRow() {
        this.getArticleList();
        this.showUnselectBtn = false;
        this.action = 'add';
    }

    updateCard(updateData) {
        const dialogRef = this.dialog.open(AboutDetailsComponent, {
            backdropClass: 'custom-dialog-backdrop-class',
            panelClass: 'custom-dialog-panel-class',
            data: {...updateData}
        });
    }
}

