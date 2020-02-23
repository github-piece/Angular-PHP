import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import { MatPaginator, MatSort } from '@angular/material';
import { MatTableDataSource } from '@angular/material';
import { first } from 'rxjs/operators';
import {CatalogueService} from '../../_services/catalogue/catalogue.service';
import {AuthenticationService} from '../../_services/authentication/authentication.service';
import {BuysellService} from '../../_services/buysell/buysell.service';

@Component({
  selector: 'app-newlistingtable',
  templateUrl: './newlistingtable.component.html',
  styleUrls: ['./newlistingtable.component.scss']
})
export class NewlistingtableComponent implements OnInit, AfterViewInit {
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  public dataSource = new MatTableDataSource<History>();
  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  public displayedColumns = ['date_created',  'b_name', 'state'];
  public displayedColumnsAdmin = ['date_created', 'u_name', 'b_name', 'state'];
  userid: any;
  u_accounttype: any;
  action: any;
  showSuperAdminHistory = false;

  constructor(
    private catalogueService: CatalogueService,
    private authenticationService: AuthenticationService,
    private buysellService: BuysellService
    ) {}

  ngOnInit() {
    this.userid = this.authenticationService.currentUserSubject.value.u_id;
    this.u_accounttype = this.authenticationService.currentUserSubject.value.u_accounttype;
    console.log('superadmin', this.u_accounttype);
    switch (this.u_accounttype) {
      case 'Super Admin':
          this.action = 'get_all';
          this.showSuperAdminHistory = true;
      break;
      default:
        this.action = 'get';
        this.showSuperAdminHistory = false;
      break;
    }
     this.getHistory();
  }
  getHistory() {

    this.buysellService.getBuyHistory(this.userid)
        .pipe(first())
        .subscribe(
            data => {
              console.log(data);
              this.dataSource.data = data as History[];
            },
            error => {
          });

  }
  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

}
