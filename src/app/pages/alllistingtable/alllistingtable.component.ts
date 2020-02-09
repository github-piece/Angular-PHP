import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort } from '@angular/material';
import { AlllistingtableDataSource } from './alllistingtable-datasource';

@Component({
  selector: 'app-alllistingtable',
  templateUrl: './alllistingtable.component.html',
  styleUrls: ['./alllistingtable.component.scss']
})
export class AlllistingtableComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  dataSource: AlllistingtableDataSource;

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['id', 'name'];

  ngOnInit() {
    this.dataSource = new AlllistingtableDataSource(this.paginator, this.sort);
  }
}
