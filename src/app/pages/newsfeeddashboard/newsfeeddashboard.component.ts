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
    userId: any;
    userType: any;
    articles = [];
    thisArticle = [];
    avatar = 'mse/uploaded/avatar/default.png';
    dataSource: any;
    tasks: any[];
    pageSize = 6;
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
            this.userId = this.authenticationService.currentUserSubject.value.u_id;
            this.userType = this.authenticationService.currentUserSubject.value.u_accounttype;
            this.getArticleList(this.userId, this.userType);
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
