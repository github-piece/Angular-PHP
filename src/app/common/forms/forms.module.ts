import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { NouisliderModule } from 'ng2-nouislider';

import { SharedModule } from '../../shared';

import {
  FormsValidationsResolver,
  FormsExtendedControlsResolver,
  FormsLayoutsResolver,
  FormsWizardResolver,
  MaterialFormsResolver
} from './forms.resolver';

import { ControlsAndValidationsPageComponent } from './pages/controls-and-validations/controls-and-validations.component';
import { ExtendedControlsPageComponent } from './pages/extended-controls/extended-controls.component';
import { SampleLayoutsPageComponent } from './pages/sample-layouts/sample-layouts.component';
import { WizardPageComponent } from './pages/wizard/wizard.component';
import { MaterialFormsPageComponent } from './pages/material-forms/material-forms.component';

export const formsRoutes = [
  {
    path: '',
    redirectTo: 'controls-and-validations'
  },
  {
    path: 'controls-and-validations',
    component: ControlsAndValidationsPageComponent,
    resolve: {
      data: FormsValidationsResolver
    }
  },
  {
    path: 'extended-controls',
    component: ExtendedControlsPageComponent,
    resolve: {
      data: FormsExtendedControlsResolver
    }
  },
  {
    path: 'sample-layouts',
    component: SampleLayoutsPageComponent,
    resolve: {
      data: FormsLayoutsResolver
    }
  },
  {
    path: 'wizard',
    component: WizardPageComponent,
    resolve: {
      data: FormsWizardResolver
    }
  },
  {
    path: 'material-forms',
    component: MaterialFormsPageComponent,
    resolve: {
      data: MaterialFormsResolver
    }
  }
];

@NgModule({
  declarations: [
    ControlsAndValidationsPageComponent,
    ExtendedControlsPageComponent,
    SampleLayoutsPageComponent,
    WizardPageComponent,
    MaterialFormsPageComponent
  ],
  imports: [
    RouterModule.forChild(formsRoutes),
    SharedModule,
    NouisliderModule
  ],
  providers: [
    FormsValidationsResolver,
    FormsExtendedControlsResolver,
    FormsLayoutsResolver,
    FormsWizardResolver,
    MaterialFormsResolver
  ]
})
export class FormsModule { }
