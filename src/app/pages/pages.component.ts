import {AfterContentInit, Component, Inject, OnInit, PLATFORM_ID, ViewChild} from '@angular/core';
import {MessagesMenuService, NotificationsMenuService, SideMenuService} from '../core';
import {isPlatformBrowser} from '@angular/common';
import {AuthenticationService} from '../_services/authentication/authentication.service';
import {first} from 'rxjs/operators';

@Component({
    selector: 'app-pages',
    templateUrl: './pages.component.html',
    styleUrls: ['./pages.component.css']
})
export class PagesComponent implements OnInit, AfterContentInit {

    @ViewChild('drawerContainer') drawerContainer;
    @ViewChild('sideMenu') sideMenu;
    @ViewChild('sideNotifications') sideNotifications;

    loading: boolean;
    notifications = [];
    messages = [];
    open_menu = false;
    userData: any = [];

    constructor(
        private sideMenuService: SideMenuService,
        private notificationsMenuService: NotificationsMenuService,
        private messagesMenuService: MessagesMenuService,
        private authenticationService: AuthenticationService,
        @Inject(PLATFORM_ID) private platformId: Object
    ) {
        notificationsMenuService.getNotifications().then((notifications: any) => {
            this.notifications = notifications;
        });
        // messagesMenuService.getMessages().then((messages: any) => {
        //     this.messages = messages;
        // });
    }
    ngOnInit() {
        this.userData = this.authenticationService.currentUserSubject.value;
        this.messagesMenuService.getData(this.userData.u_id)
            .pipe(first())
            .subscribe(data => {
                this.messages = data;
                let count = 0;
                for (let i = 0; i < this.messages.length; i++) {
                    if (this.messages[i].status === '0') {
                        count++;
                    }
                }
                if (this.messages.length) {
                    this.messages[0]['count'] = count;
                }
            });
        this.loading = false;
    }

    ngAfterContentInit(): void {
        this.sideMenuService.sidenav = this.sideMenu;
        this.sideMenuService.drawerContainer = this.drawerContainer;
        this.notificationsMenuService.sidenav = this.sideNotifications;
        if (isPlatformBrowser(this.platformId)) {
            this.open_menu = true;
        }
    }

}
