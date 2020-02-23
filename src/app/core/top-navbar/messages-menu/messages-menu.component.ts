import {Component, Input, OnInit, ViewEncapsulation} from '@angular/core';
import { NotificationsMenuService } from '../notifications-menu/notifications-menu.service';
import {MessagesMenuService} from './messages-menu.service';
import {first} from 'rxjs/operators';

@Component({
  selector: 'app-messages-menu',
  styleUrls: ['./styles/messages-menu.scss'],
  templateUrl: './messages-menu.component.html',
  encapsulation: ViewEncapsulation.None
})
export class MessagesMenuComponent {
  @Input() messages: any;
  constructor(
      private notificationsMenuService: NotificationsMenuService,
      private messagesMenuService: MessagesMenuService
  ) {

  }

  closeNotificationsMenu(): void {
    this.notificationsMenuService.sidenav.close();
  }

  check(id: any) {
    this.messagesMenuService.setData(id)
        .pipe(first())
        .subscribe();
    this.messages[0].count = this.messages[0].count - 1;
  }
}
