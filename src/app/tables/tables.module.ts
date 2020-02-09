import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from '../shared';

import { TableDataService } from './services/table-data.service';
import { RegularTablesResolver, ExtendedTablesResolver, SmartTablesResolver } from './resolvers/tables.resolver';

import { ExtendedTablesPageComponent } from './pages/extended/extended-tables.component';
import { RegularTablesPageComponent } from './pages/regular/regular-tables.component';
import { SmartTablesPageComponent } from './pages/smart/smart-tables.component';

import { NouisliderModule } from 'ng2-nouislider';

import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';

export const tablesRoutes = [
  { path: '', redirectTo: 'regular' },
  {
    path: 'regular',
    component: RegularTablesPageComponent,
    resolve: {
      tableData : RegularTablesResolver
    }
  },
  {
    path: 'extended',
    component: ExtendedTablesPageComponent,
    resolve: {
      tableData : ExtendedTablesResolver
    }
  },
  {
    path: 'smart',
    component: SmartTablesPageComponent,
    resolve: {
      tableData : SmartTablesResolver
    }
  }
];

@NgModule({
  declarations: [
    RegularTablesPageComponent,
    ExtendedTablesPageComponent,
    SmartTablesPageComponent
  ],

  providers: [
    TableDataService,
    RegularTablesResolver,
    ExtendedTablesResolver,
    SmartTablesResolver
  ],

  imports: [
    RouterModule.forChild(tablesRoutes),
    NouisliderModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule,
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule
  ]
})
export class TablesModule { }
