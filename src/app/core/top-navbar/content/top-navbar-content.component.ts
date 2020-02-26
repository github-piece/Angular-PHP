import {Component, Input, ViewEncapsulation, Inject, OnInit} from '@angular/core';
import { SideMenuService } from '../../side-menu/side-menu.service';
import { ResponsiveBreakpointsService } from '../../responsive-breakpoints/responsive-breakpoints.service';
import { APP_BASE_HREF } from '@angular/common';
import { filter } from 'rxjs/operators';
import {AuthenticationService} from '../../../_services/authentication/authentication.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-top-navbar-content',
  styleUrls: ['./styles/top-navbar-content.scss'],
  templateUrl: './top-navbar-content.component.html',
  encapsulation: ViewEncapsulation.None
})
export class TopNavbarContentComponent implements OnInit {
  @Input() messages = [];
  @Input() notifications = [];

  sideMenuVisible = true;
  baseUrl = '';
  myData: any;

  constructor(
    private sideMenuService: SideMenuService,
    private responsiveService: ResponsiveBreakpointsService,
    @Inject(APP_BASE_HREF) private baseHref: string,
    private authService: AuthenticationService,
    private router: Router,
  ) {
    this.baseUrl = baseHref;
    responsiveService.responsiveSubject
      .pipe(
        filter(breakpoint => breakpoint.screen === 'xs-or-sm')
      )
      .subscribe(breakpoint => {
        if (breakpoint.active) {
          this.sideMenuService.sidenav.mode = 'push';
          this.sideMenuService.sidenav.close().then(
            val => {
              // console.log('ok closing');
              this.sideMenuVisible = false;
            },
            err => {
              // console.log('error closing');
            },
            () => {
              // console.log('all closing');
            }
          );
        } else {
          this.sideMenuService.sidenav.mode = 'side';
        }
      });
  }
  ngOnInit() {
    this.myData = this.authService.currentUserSubject.value;
  }

  toggleSideMenu(): void {
    this.sideMenuService.sidenav.toggle();
  }
  logout() {
    this.authService.logout();
    this.router.navigate(['']);
  }
}
