import {NgModule} from '@angular/core';
import {ServerModule, ServerTransferStateModule} from '@angular/platform-server';
import {ModuleMapLoaderModule} from '@nguniversal/module-map-ngfactory-loader';

import {AppModule} from './app.module';
import {AppComponent} from './app.component';
import {APP_BASE_HREF} from '@angular/common';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {environment} from '../environments/environment';

@NgModule({
    imports: [
        AppModule,
        ServerModule,
        ModuleMapLoaderModule,
        ServerTransferStateModule,
        NoopAnimationsModule
    ],
    bootstrap: [AppComponent],
    providers: [
        {
            provide: APP_BASE_HREF,
            useValue: `${environment.BASE_URL}`
        }
    ]
})
export class AppServerModule {
}
