import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import {ForgotpwdService} from '../../_services/forgotpwd/forgotpwd.service';
import {AlertService} from '../../_services/common/alert.service';
import {first} from 'rxjs/operators';

@Component({
  selector: 'app-sendmail',
  templateUrl: './sendmail.component.html',
  styleUrls: ['./sendmail.component.scss']
})
export class SendmailComponent implements OnInit {
  sendmailForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private forgotPwdService: ForgotpwdService,
    private alertService: AlertService

  ) { }

  ngOnInit() {
    this.sendmailForm = this.formBuilder.group({
      u_email: ['', [Validators.required, Validators.email]]
    });

  }
  get f() { return this.sendmailForm.controls; }

  onSubmit() {
    this.submitted = true;
    if (this.sendmailForm.invalid) {
        return;
    }

    this.loading = true;
    this.forgotPwdService.sendmail(this.f.u_email.value)
        .pipe(first())
        .subscribe(
            data => {
                this.router.navigate([this.returnUrl]);
            },
            error => {
                this.alertService.error(error);
                this.loading = false;
            });
}
}
