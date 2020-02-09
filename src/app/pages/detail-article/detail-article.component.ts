import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import {AuthenticationService} from '../../_services/authentication/authentication.service';
import {UserService} from '../../_services/user/user.service';
import {NewsfeedService} from '../../_services/newsfeed/newsfeed.service';
import {URL_SERVICIOS} from '../../../config/url.servicios';


@Component({
  selector: 'app-detail-article',
  templateUrl: './detail-article.component.html',
  styleUrls: ['./detail-article.component.scss']
})
export class DetailArticleComponent implements OnInit {
  showActions = false;
  u_id: any;
  u_accounttype: any;
  articleNum: any;
  section1: any;
  section2: any;
  headline: any;
  imgurl1: any;
  imgurl2: any;
  showPreviousBtn = false;
  showNextBtn = false;

  rowData = [];  // datas for userlist
  rowData_user = [];  // datas for userlist

  freezedflag: any;
  selected_id: any;
  select_articleUsertype: any;
  constructor( private authenticationService: AuthenticationService,
              private userService: UserService,
              private newsfeedService: NewsfeedService,
              private route: ActivatedRoute
              ) { }

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

    this.route.queryParams.subscribe(params => {
      this.selected_id = params.selectArticleid;
      this.select_articleUsertype = params.articleUsertype;

    });

    switch (this.select_articleUsertype) {
      case 'admin':
        this.getArticleList_Admin();
        break;
      case 'user':
        this.getArticleList_User();
        break;
      case 'all':
        this.getArticleList();
        break;
      }

  }
  getArticleList() {
    this.newsfeedService.getArticleList(this.u_accounttype, this.u_id)
    .pipe(first())
    .subscribe(
        data => {
          this.rowData = data;
          this.rowData = data;
          for (let i = 0; i < this.rowData.length; i++) {
            if (this.rowData[i].id === this.selected_id) {
              this.articleNum = this.rowData[i].no;
              if (this.articleNum < 2) {
                this.showPreviousBtn = false;
              } else {
                this.showPreviousBtn = true;
              }
              console.log(this.articleNum);
              console.log(this.rowData.length);
              if (this.articleNum > this.rowData.length - 1) {
                this.showNextBtn = false;
              } else {
                this.showNextBtn = true;
              }

              break;
            }
          }
          this.section1 = this.rowData[this.articleNum - 1].section1;
          this.section2 = this.rowData[this.articleNum - 1].section1;
          this.headline = this.rowData[this.articleNum - 1].headline;
          this.imgurl1 = `${URL_SERVICIOS}/uploaded/` + this.rowData[this.articleNum - 1].imgurl1;
          this.imgurl2 = `${URL_SERVICIOS}/uploaded/` + this.rowData[this.articleNum - 1].imgurl2;
          console.log('section1', this.section1);
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
          this.rowData = data;
          this.rowData = data;
          for (let i = 0; i < this.rowData.length; i++) {
            if (this.rowData[i].id === this.selected_id) {
              this.articleNum = this.rowData[i].no;
              if (this.articleNum < 2) {
                this.showPreviousBtn = false;
              } else {
                this.showPreviousBtn = true;
              }
              console.log(this.articleNum);
              console.log(this.rowData.length);
              if (this.articleNum > this.rowData.length - 1) {
                this.showNextBtn = false;
              } else {
                this.showNextBtn = true;
              }

              break;
            }
          }
          this.section1 = this.rowData[this.articleNum - 1].section1;
          this.section2 = this.rowData[this.articleNum - 1].section1;
          this.headline = this.rowData[this.articleNum - 1].headline;
          this.imgurl1 = `${URL_SERVICIOS}/uploaded/` + this.rowData[this.articleNum - 1].imgurl1;
          this.imgurl2 = `${URL_SERVICIOS}/uploaded/` + this.rowData[this.articleNum - 1].imgurl2;
          console.log('section1', this.section1);
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
        this.rowData = data;
        for (let i = 0; i < this.rowData.length; i++) {
          if (this.rowData[i].id === this.selected_id) {
            this.articleNum = this.rowData[i].no;
            if (this.articleNum < 2) {
              this.showPreviousBtn = false;
            } else {
              this.showPreviousBtn = true;
            }
            console.log(this.articleNum);
            console.log(this.rowData.length);
            if (this.articleNum > this.rowData.length - 1) {
              this.showNextBtn = false;
            } else {
              this.showNextBtn = true;
            }

            break;
          }
        }
        this.section1 = this.rowData[this.articleNum - 1].section1;
        this.section2 = this.rowData[this.articleNum - 1].section1;
        this.headline = this.rowData[this.articleNum - 1].headline;
        this.imgurl1 = `${URL_SERVICIOS}/uploaded/` + this.rowData[this.articleNum - 1].imgurl1;
        this.imgurl2 = `${URL_SERVICIOS}/uploaded/` + this.rowData[this.articleNum - 1].imgurl2;
        console.log('section1', this.section1);
      },
      error => {
        console.log('error', error);
    });
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

  previousArticle() {
    this.showNextBtn = true;
    this.articleNum = this.articleNum - 1;
    if (this.articleNum < 2) {
      this.showPreviousBtn = false;
     // return;
    }
    this.section1 = this.rowData[this.articleNum - 1].section1;
    this.section2 = this.rowData[this.articleNum - 1].section1;
    this.headline = this.rowData[this.articleNum - 1].headline;
    this.imgurl1 = `${URL_SERVICIOS}/uploaded/` + this.rowData[this.articleNum - 1].imgurl1;
    this.imgurl2 = `${URL_SERVICIOS}/uploaded/` + this.rowData[this.articleNum - 1].imgurl2;

  }

  nextArticle() {
    this.showPreviousBtn = true;
    this.articleNum = this.articleNum + 1;
    if (this.articleNum > this.rowData.length - 1) {
      this.showNextBtn = false;
     // return;
    }
    this.section1 = this.rowData[this.articleNum - 1].section1;
    this.section2 = this.rowData[this.articleNum - 1].section1;
    this.headline = this.rowData[this.articleNum - 1].headline;
    this.imgurl1 = `${URL_SERVICIOS}/uploaded/` + this.rowData[this.articleNum - 1].imgurl1;
    this.imgurl2 = `${URL_SERVICIOS}/uploaded/` + this.rowData[this.articleNum - 1].imgurl2;

  }
}
