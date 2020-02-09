import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AuthComponent} from './auth.component';
import {AuthRoutingModule} from './auth-routing.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {LoginComponent} from './login/login.component';
import {RegistComponent} from './regist/regist.component';
import {MatDividerModule} from '@angular/material';

@NgModule({
    declarations: [
        AuthComponent,
        LoginComponent,
        RegistComponent
    ],
    exports: [
        LoginComponent
    ],
    imports: [
        CommonModule,
        AuthRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        MatDividerModule,
    ]
})
export class AuthModule {
}
