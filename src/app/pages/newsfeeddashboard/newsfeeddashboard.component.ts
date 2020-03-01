import {Component, OnInit, ViewChild} from '@angular/core';
import {AuthenticationService} from '../../_services/authentication/authentication.service';
import {NewsfeedService} from '../../_services/newsfeed/newsfeed.service';
import {first} from 'rxjs/operators';
import {URL_SERVICIOS} from '../../../config/url.servicios';
import {MatPaginator, MatTableDataSource, PageEvent} from '@angular/material';

@Component({
    selector: 'app-newsfeeddashboard',
    templateUrl: './newsfeeddashboard.component.html',
    styleUrls: ['./newsfeeddashboard.component.scss']
})
export class NewsfeeddashboardComponent implements OnInit {
    showActions = false;
    userEmail: any;
    userData: any = [];
    userType: any;
    articles = [];
    thisArticle = [];
    avatar = 'mse/uploaded/avatar/default.png';
    dataSource: any;
    tasks: any[];
    pageSize = 3;
    currentPage = 0;
    totalSize = 0;

    @ViewChild(MatPaginator) paginator: MatPaginator;

    constructor(
        private authenticationService: AuthenticationService,
        private newsfeedService: NewsfeedService,
    ) {
    }

    ngOnInit(): void {
        if (this.authenticationService.currentUserSubject.value == null) {
            this.showActions = false;
        } else {
            this.showActions = true;
            this.userData = this.authenticationService.currentUserSubject.value;
            this.getArticleList(this.userData.u_id, this.userData.u_accounttype);
        }
    }

    getArticleList(id, type) {
        this.newsfeedService.getArticleList(type, id)
            .pipe(first())
            .subscribe(
                data => {
                    this.articles = data;
                    for (let i = 0; i < this.articles.length; i++) {
                        this.articles[i].imgurl1 = `${URL_SERVICIOS}/uploaded/` + this.articles[i].imgurl1;
                        this.articles[i].imgurl2 = `${URL_SERVICIOS}/uploaded/` + this.articles[i].imgurl2;
                    }
                    this.thisArticle = this.articles[0];
                    this.getTasks();
                },
                error => {
                });
    }
    viewArticle(id) {
        const thisArticle = this.articles.filter(d => d.id === id);
        this.thisArticle = thisArticle[0];
    }
    getTasks() {
        // Replace with HTTP call
        const data = this.articles;
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
