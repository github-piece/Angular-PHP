import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { ChartsModule as ng2ChartsModule } from 'ng2-charts';

import { ChartsDataService, Ng2ChartsResolver } from '../common/charts';

import { LayoutsService } from './services/layouts.service';
import { ListsResolver, CardsResolver } from './resolvers/layouts.resolver';

import { CardsPageComponent } from './pages/cards/cards.component';
import { GridsPageComponent } from './pages/grids/grids.component';
import { ListsPageComponent } from './pages/lists/lists.component';
import { TabsPageComponent } from './pages/tabs/tabs.component';

import { SharedModule } from '../shared';

export const layoutsRoutes = [
  {
    path: '',
    redirectTo: 'grids'
  },
  {
    path: 'grids',
    component: GridsPageComponent
  },
  {
    path: 'lists',
    component: ListsPageComponent,
    resolve: {
      data : ListsResolver
    }
  },
  {
    path: 'cards',
    component: CardsPageComponent,
    resolve: {
      data : CardsResolver
    }
  },
  {
    path: 'tabs',
    component: TabsPageComponent,
    resolve: {
      data : Ng2ChartsResolver
    }
  }
];

@NgModule({
  declarations: [
    GridsPageComponent,
    ListsPageComponent,
    CardsPageComponent,
    TabsPageComponent
  ],
  providers: [
    ChartsDataService,
    Ng2ChartsResolver,
    ListsResolver,
    CardsResolver,
    LayoutsService
  ],
  imports: [
    RouterModule.forChild(layoutsRoutes),
    CommonModule,
    ng2ChartsModule,
    SharedModule
  ]
})
export class LayoutsModule {}
