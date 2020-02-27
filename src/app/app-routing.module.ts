import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {Error404PageComponent, Error404PageResolver} from './core';
import {RegularTablesResolver, TableDataService} from './tables';
import {ModalComponent} from './pages/modal/modal.component';
import {MainComponent} from './front/main/main.component';
import {ContactComponent} from './front/contact/contact.component';
import {AboutComponent} from './front/about/about.component';
import {LoginComponent} from './front/auth/login.component';
import {RegisterComponent} from './front/auth/register.component';
import {SuccessComponent} from './payment/success/success.component';
import {CancelComponent} from './payment/cancel/cancel.component';

const routes: Routes = [
    {
        path: '', component: MainComponent,
        resolve: {
            tableData: RegularTablesResolver
        }
    },
    {path: 'contact', component: ContactComponent},
    {path: 'about', component: AboutComponent},
    {path: 'login', component: LoginComponent},
    {path: 'register', component: RegisterComponent},
    {path: 'success', component: SuccessComponent},
    {path: 'cancel', component: CancelComponent},
    {
        path: 'pages',
        loadChildren: () => import('./pages/pages.module').then(m => m.PagesModule)
    },

    {
        path: '**',
        component: Error404PageComponent,
        resolve: {data: Error404PageResolver}
    }

];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
    providers: [
        TableDataService,
        RegularTablesResolver,
    ],
    entryComponents: [
        ModalComponent,
    ]
})
export class AppRoutingModule {
}
