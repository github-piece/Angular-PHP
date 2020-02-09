import {AfterContentInit, Component, ViewChild, ViewEncapsulation, PLATFORM_ID, Inject, OnInit} from '@angular/core';
import { MessagesMenuService, NotificationsMenuService, SideMenuService } from './core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: [ './common/styles/app.scss' ],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit, AfterContentInit {
  @ViewChild('drawerContainer') drawerContainer;
  @ViewChild('sideMenu') sideMenu;
  @ViewChild('sideNotifications') sideNotifications;

  loading: boolean;
  notifications = [];
  messages = [];
  open_menu = false;

  constructor(
    private sideMenuService: SideMenuService,
    private notificationsMenuService: NotificationsMenuService,
    private messagesMenuService: MessagesMenuService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    notificationsMenuService.getNotifications().then((notifications: any) => {
      this.notifications = notifications;
    });
    messagesMenuService.getMessages().then((messages: any) => {
      this.messages = messages;
    });
  }
  ngOnInit() {
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
