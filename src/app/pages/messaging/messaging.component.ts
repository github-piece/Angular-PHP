import {Component, OnInit, ViewChild} from '@angular/core';
import {AuthenticationService} from '../../_services/authentication/authentication.service';
import {UserService} from '../../_services/user/user.service';
import { first } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {ArticleService} from '../../_services/article/article.service';
import {MatPaginator, MatTableDataSource, PageEvent} from '@angular/material';

@Component({
  selector: 'app-messaging',
  templateUrl: './messaging.component.html',
  styleUrls: ['./messaging.component.css'],
})
export class MessagingComponent implements OnInit {

  rowData = [];
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

  dataSource: any;
  tasks: any[];
  pageSize = 4;
  currentPage = 0;
  totalSize = 0;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(
      private formBuilder: FormBuilder,
      private userService: UserService,
      private articleService: ArticleService,
      private authenticationService: AuthenticationService
  ) {}
  ngOnInit() {
    if (this.authenticationService.currentUserSubject.value == null) {
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
          this.getTask();
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
          this.freezedflag = data.u_freezedflag;
          this.showActions = this.freezedflag !== 1;
        });
  }
  submitArticle() {
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
    formData.append('headline', this.articleForm.get('headline').value);
    this.articleService.articleSubmit(formData)
    .pipe(first())
    .subscribe(
        data => {
          this.rowData = data;
          setTimeout(() => { this.articleloading = false; }, 1500);
          this.getTask();
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
          this.getTask();
        });
  }
  unselectRow() {
    this.getArticleList();
    this.showUnselectBtn = false;
    this.action = 'add';
  }
  getTask() {
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
}



