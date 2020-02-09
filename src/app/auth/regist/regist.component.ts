import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import {UserService} from '../../_services/user/user.service';
import {AlertService} from '../../_services/common/alert.service';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { MustMatch } from '../../_helpers/must-match';

@Component({
  selector: 'app-regist',
  templateUrl: './regist.component.html',
  styleUrls: ['./regist.component.scss']
})
export class RegistComponent implements OnInit {
  registerForm: FormGroup;
  loading = false;
  submitted = false;
  duplicate = false;
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private userService: UserService,
    private alertService: AlertService
    ) {}

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      u_name: ['', Validators.required],
      u_email: ['', [Validators.required, Validators.email]],
      u_phonenum: ['', Validators.required],
      u_password: ['', [Validators.required, Validators.minLength(6)]],
      u_confirmPassword: ['', Validators.required]},
      {
        validator: MustMatch('u_password', 'u_confirmPassword')
    });

  }
  get f() { return this.registerForm.controls; }

  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    console.log(this.registerForm.invalid);
    if (this.registerForm.invalid) {
        return;
    }

    this.loading = true;

    this.userService.register(this.registerForm.value)
        .pipe(first())
        .subscribe(
            data => {
              console.log(data);
              if (data === 2) {
                this.duplicate = true;
                this.loading = false;
                return;
              }
                this.alertService.success('Registration successful', true);
                this.router.navigate(['']);
            },
            error => {
                this.alertService.error(error);
                this.loading = false;
            });
  }
}
