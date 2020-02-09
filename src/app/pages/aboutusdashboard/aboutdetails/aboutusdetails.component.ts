import {Component, Inject, OnInit, Optional} from '@angular/core';
import {FormGroup, FormBuilder, Validators, FormControl, NgForm} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {UserService} from '../../../_services/user/user.service';
import {AboutusService} from '../../../_services/aboutus/aboutus.service';

@Component({
    selector: 'app-aboutusupdate',
    templateUrl: './aboutdetails.component.html',
    styleUrls: ['./aboutdetails.component.scss']
})
export class AboutDetailsComponent implements OnInit {
    item: any;
    croppedImage: any;
    imageSelected: boolean;
    imageChanged: boolean;
    rowData = [];

    showActions = false;
    submitted = false;
    action: any = 'add';

    u_id: any;
    u_parentid: any;

    u_accounttype: any;
    imgurl: any;
    articleloading = false;
    public message: string;
    private rowSelection;
    updateId: number;
    deleteId: number;
    fromPage: string;
    newCardData: { id: any; imgurl: any; section1: any; section2: any; headline: any };

    constructor(
        private formBuilder: FormBuilder,
        private aboutService: AboutusService,
        private activeRoute: ActivatedRoute,
        private userService: UserService,
        private route: ActivatedRoute,
        private router: Router,
        public dialogRef: MatDialogRef<AboutDetailsComponent>,
        @Optional() @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        this.fromPage = data.pageValue;
    }

    editServiceForm = new FormGroup({
        id: new FormControl(''),
        headline: new FormControl(''),
        section1: new FormControl(''),
        section2: new FormControl(''),
        imgurl: new FormControl(''),
    });

    ngOnInit() {
        this.rowSelection = 'single';
        this.showActions = true;
        this.imageChanged = false;
        this.imageSelected = false;
        this.croppedImage = this.imgurl;
        this.route.data.subscribe(routeData => {
            const data = this.data;
            if (data) {
                this.item = data;
                this.createForm();
            }
        });
    }

    createForm() {
        this.editServiceForm = this.formBuilder.group({
            id: [this.item.id, Validators.required],
            headline: [this.item.headline, Validators.required],
            section1: [this.item.section1, Validators.required],
            section2: [this.item.section2, Validators.required],
            imgurl: [this.item.imgurl, Validators.required],
        });
    }

    updateCard(id: number) {
        id = this.data.id;
        this.newCardData = {
            id: id,
            section1: this.editServiceForm.value.section1,
            section2: this.editServiceForm.value.section2,
            headline: this.editServiceForm.value.headline,
            imgurl: this.editServiceForm.value.imgurl,
        };
        this.aboutService.updateArticle(this.newCardData).subscribe(data => {
            console.log(data);
            console.log('update success');
            this.dialogRef.close();
        });
        this.aboutService.getArticleList(this.newCardData);
    }

    deleteCard(formData) {
        formData = this.editServiceForm.value;
        this.aboutService.deleteArticle(formData)
            .subscribe(res => {
                    console.log(res);
                    this.dialogRef.close();
                }, err => {
                    console.log(err);
                    this.dialogRef.close();
                }
            );
        this.aboutService.getArticleList(formData);
    }
    cancelCard() {
        this.dialogRef.close();
    }
}


