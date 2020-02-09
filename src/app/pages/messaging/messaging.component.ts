import {Component, OnInit,ViewChild} from '@angular/core';
import { map } from 'rxjs/operators';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import {AuthenticationService} from '../../_services/authentication/authentication.service';
import {UserService} from '../../_services/user/user.service';
import { first } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {ArticleService} from '../../_services/article/article.service';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
@Component({
  selector: 'app-messaging',
  templateUrl: './messaging.component.html',
  styleUrls: ['./messaging.component.css'],
})
export class MessagingComponent implements OnInit {

  /** Based on the screen size, switch from standard to one column per row */
  cards = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map(({ matches }) => {
      if (matches) {
        return [
          { title: 'Headline', cols: 1, rows: 1 },
          { title: 'Choose First File', cols: 1, rows: 1 },
          { title: 'Choose Second File', cols: 1, rows: 1 },
          { title: 'Section', cols: 1, rows: 1 }
        ];
      }

      return [
        { title: 'Headline', cols: 2, rows: 1, showoption: 'section1', type: 'Section'},
        { title: 'Choose First File', cols: 1, rows: 1, showoption: 'upload1', type: 'Image' },
        { title: 'Choose Second File', cols: 1, rows: 2, showoption: 'section2', type: 'Section' },
        { title: 'Card 4', cols: 1, rows: 1,  showoption: 'upload2', type: 'Image' }
      ];
    })
  );

  // @ts-ignore

  rowData = [];

  columnDefs = [
    {headerName: 'No', field: 'no', width: 50},
    {headerName: 'Headline', field: 'headline' , width: 400},
    {headerName: 'Created Date', field: 'article_createdate' , width: 300},
    {headerName: 'Account Type', field: 'u_accounttype', width: 300}

];
  articleForm: FormGroup;

  showActions = false;
  submitted = false;
  action: any = 'add';

  u_id: any;
  u_parentid: any;

  u_accounttype: any;
  freezedflag: any;
  public imagePath;
  imgURL1: any;
  imgURL2: any;
  articleloading = false;
  showDeleteBtn = false;
  showUnselectBtn = false;
  showImage = false;
  showImage2 = false;

  public message: string;

  file1: File = null;
  file2: File = null;
  private rowSelection;

  rowselect_id: any;
  rowselect_headline: any;
  rowselect_section1: any;
  rowselect_section2: any;
  gridOptions: any;

  constructor(private breakpointObserver: BreakpointObserver,
              private formBuilder: FormBuilder,
              private userService: UserService,
              private articleService: ArticleService,
              private authenticationService: AuthenticationService) {}

  displayedColumns: string[] = ['no', 'headline', 'article_createdate', 'u_accounttype'];
  ngOnInit() {
    if (this.authenticationService.currentUserSubject.value == null) {   // if user didnt login
      this.showActions = false;
      return;
    } else {
    this.u_id = this.authenticationService.currentUserSubject.value.u_id;
    }
    this.u_parentid = this.authenticationService.currentUserSubject.value.u_parentid;
    this.u_accounttype = this.authenticationService.currentUserSubject.value.u_accounttype;

    this.getFreezeFlag(this.u_id);
    this.rowSelection = 'single';

    this.articleForm = this.formBuilder.group({
      headline: ['', Validators.required],
      section1: ['', Validators.required],
      section2: ['', Validators.required],
      file1: [''],
      file2: ['']});
      this.getArticleList();
      this.showActions = true;

  }

  getArticleList() {
    const formData = new FormData();

    formData.append('u_id', this.u_id);
    formData.append('u_parentid', this.u_parentid);
    formData.append('u_accounttype', this.u_accounttype);
    formData.append('action', 'get');

    this.articleService.getArticleList(formData)
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
  get f() { return this.articleForm.controls; }

  preview1(files) {

    if (files.length === 0) {
      return;
    }

    const mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      this.message = 'Only images are supported.';
      return;
    }

    const reader = new FileReader();
    this.imagePath = files;
    reader.readAsDataURL(files[0]);
    reader.onload = (_event) => {
      this.imgURL1 = reader.result;
    };
    this.file1 = files.item(0);
    this.showImage = true;
  }

  preview2(files) {
    if (files.length === 0) {
      return;
    }

    const mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      this.message = 'Only images are supported.';
      return;
    }

    const reader = new FileReader();
    this.imagePath = files;
    reader.readAsDataURL(files[0]);
    reader.onload = (_event) => {
      this.imgURL2 = reader.result;
    };
    this.file2 = files.item(0);
    this.showImage2 = true;

  }
  getFreezeFlag(u_id: any) {
    this.userService.getFreezeFlag( u_id)
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
    if (this.articleForm.invalid) {
        return;
    }
    this.articleloading = true;

    const formData = new FormData();

    formData.append('u_id', this.u_id);
    formData.append('u_parentid', this.u_parentid);
    formData.append('u_accounttype', this.u_accounttype);
    formData.append('action', this.action);
    formData.append('id', this.rowselect_id);

    formData.append('file1', this.file1);
    formData.append('file2', this.file2);

    formData.append('section1', this.articleForm.get('section1').value);
    formData.append('section2', this.articleForm.get('section2').value);
    formData.append('section2', this.articleForm.get('section2').value);
    formData.append('headline', this.articleForm.get('headline').value);
    this.articleService.articleSubmit(formData)
    .pipe(first())
    .subscribe(
        data => {
          this.rowData = data;
          setTimeout(() => { this.articleloading = false; }, 1500);

        },
        error => {
          console.log('error', error);
    });
  }
  deleteArticle() {
    const formData = new FormData();

    formData.append('u_id', this.u_id);
    formData.append('u_parentid', this.u_parentid);
    formData.append('u_accounttype', this.u_accounttype);
    formData.append('action', 'aboutus_delete.php');
    formData.append('id', this.rowselect_id);

    this.articleService.deleteArticle(formData)
    .pipe(first())
    .subscribe(
        data => {
          this.rowData = data;
          this.showUnselectBtn = false;
          this.action = 'add';
        },
        error => {
          console.log('error', error);
    });
  }

  unselectRow() {
    this.getArticleList();
    this.showUnselectBtn = false;
    this.action = 'add';
  }

  onSelectionChanged(event: any) {
    this.action = 'aboutus_update.php';
    this.showUnselectBtn = true;
    this.showImage = true;
    this.showImage2 = true;

    if (this.u_accounttype === 'Super Admin') {
      this.showDeleteBtn = true;
    }

  //  this.showAdduserCard = true;
  //  this.showUpdateUser = true;  //if i select row on userlist table we will see update user button.
    this.rowselect_id = event.api.getSelectedRows()[0].id;

    this.rowselect_section1 = event.api.getSelectedRows()[0].section1;
    this.rowselect_section2 = event.api.getSelectedRows()[0].section2;
    this.rowselect_headline = event.api.getSelectedRows()[0].headline;
    this.imgURL1 = 'http://localhost/mse/uploaded/' + event.api.getSelectedRows()[0].imgurl1;
    this.imgURL2 = 'http://localhost/mse/uploaded/' + event.api.getSelectedRows()[0].imgurl2;



  }
}



