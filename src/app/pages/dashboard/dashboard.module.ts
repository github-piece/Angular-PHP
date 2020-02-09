import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {ChartsModule} from 'ng2-charts';

import { ChartsDataService, Ng2ChartsResolver } from '../../common/charts';
import { SharedModule } from '../../shared';

import { ExtendedTablesResolver, TableDataService } from '../../tables';
import { MatTableModule } from '@angular/material/table';

import { DashboardPageComponent } from './dashboard.component';
import { DashboardResolver } from './dashboard.resolver';

export const DashboardRoutes = [
  {
    path: '',
    component: DashboardPageComponent,
    resolve: {
      data: DashboardResolver,
      chart: Ng2ChartsResolver,
      table: ExtendedTablesResolver
    }
  }
];

@NgModule({
  declarations: [
    DashboardPageComponent
  ],
  imports: [
    RouterModule.forChild(DashboardRoutes),
    CommonModule,
    SharedModule,
    MatTableModule,
    ChartsModule
  ],
  providers: [
    DashboardResolver,
    Ng2ChartsResolver,
    ChartsDataService,
    ExtendedTablesResolver,
    TableDataService
  ]
})
export class DashboardModule { }
