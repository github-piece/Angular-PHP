import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router, ActivatedRoute} from '@angular/router';
import {AlertService} from '../../_services/common/alert.service';
import {AuthenticationService} from '../../_services/authentication/authentication.service';
import {first} from 'rxjs/operators';
import {AuthService} from 'angularx-social-login';
import {SocialUser} from 'angularx-social-login';
import {GoogleLoginProvider, FacebookLoginProvider} from 'angularx-social-login';
import {UserService} from '../../_services/user/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: [
    './css/login.component.css',
    './css/font-awesome.min.css'
  ]
})
export class LoginComponent implements OnInit {
  @ViewChild('googleLoginRef') googleLoginElement: ElementRef;
  loginForm: FormGroup;
  loading: boolean;
  submitted = false;
  returnUrl: string;
  user: SocialUser;
  constructor(
      private formBuilder: FormBuilder,
      private route: ActivatedRoute,
      private router: Router,
      private authenticationService: AuthenticationService,
      private alertService: AlertService,
      private authService: AuthService,
      private userService: UserService
  ) {
  }

  ngOnInit() {
    this.loading = false;
    this.loginForm = this.formBuilder.group({
      u_email: ['', [Validators.required, Validators.email]],
      u_password: ['', Validators.required]
    });
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    this.authService.authState.subscribe((user) => {
      this.user = user;
    });
  }

  signInWithGoogle(): void {
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID).then(x => {
      localStorage.setItem('currentUser', JSON.stringify(x));
      this.userService.socialLogin(x)
          .pipe(first())
          .subscribe(data => {
          });
      window.location.replace('/pages/maindashboard');
    });
  }

  signInWithFB(): void {
    this.authService.signIn(FacebookLoginProvider.PROVIDER_ID).then(x => {
      console.log(x);
      this.router.navigate(['pages/maindashboard']);
    });
  }

  get f() {
    return this.loginForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    if (this.loginForm.invalid) {
      return;
    }
    this.loading = true;
    this.authenticationService.login(this.f.u_email.value, this.f.u_password.value)
        .pipe(first())
        .subscribe(
            data => {
              if (data.status === 1) {
                this.router.navigate(['/pages/maindashboard']);
              } else {
                this.router.navigate(['']);
                this.loading = false;
                this.alertService.error('login failed');
              }
            });
  }
  signInWithLinkedIn() {
  }
}
