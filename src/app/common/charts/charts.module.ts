import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NvD3Module } from 'ng2-nvd3';
import { ChartsModule as ng2ChartsModule } from 'ng2-charts';

import 'chart.js';
import 'd3';
import 'nvd3';

import { MatTabsModule } from '@angular/material';

import { ChartsDataService } from './services/charts-data.service';
import { Ng2ChartsResolver, Ng2Nvd3ChartsResolver } from './resolvers/charts.resolver';
import { Ng2ChartsPageComponent } from './pages/ng2-charts/ng2-charts.component';
import { Ng2Nvd3PageComponent } from './pages/ng2-nvd3/ng2-nvd3.component';

export const chartsRoutes = [
  {
    path: '',
    redirectTo: 'ng2Charts'
  },
  {
    path: 'ng2Charts',
    component: Ng2ChartsPageComponent,
    resolve: {
      data : Ng2ChartsResolver
    }
  },
  {
    path: 'ng2Nvd3',
    component: Ng2Nvd3PageComponent,
    resolve: {
      data : Ng2Nvd3ChartsResolver
    }
  }
];

@NgModule({
  declarations: [
    Ng2Nvd3PageComponent,
    Ng2ChartsPageComponent
  ],

  providers: [
    ChartsDataService,
    Ng2ChartsResolver,
    Ng2Nvd3ChartsResolver
  ],

  imports: [
    RouterModule.forChild(chartsRoutes),
    CommonModule,
    MatTabsModule,
    NvD3Module,
    ng2ChartsModule
  ]
})
export class ChartsModule { }
