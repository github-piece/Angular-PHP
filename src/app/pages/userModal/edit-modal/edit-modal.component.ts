import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MustMatch} from '../../../_helpers/must-match';
import {first} from 'rxjs/operators';
import {UserService} from '../../../_services/user/user.service';

@Component({
  selector: 'app-edit-modal',
  templateUrl: './edit-modal.component.html',
  styleUrls: ['./edit-modal.component.css']
})
export class EditModalComponent implements OnInit {

  userData: any;
  totalUserData: any;
  userId: any;
  accountType: any;
  onShow = false;
  notMatch: any;
  changeForm: FormGroup;
  submitted = false;
  constructor(
      private userService: UserService,
      private fb: FormBuilder,
      private dialogRef: MatDialogRef<EditModalComponent>,
      @Inject(MAT_DIALOG_DATA) data
  ) {
    this.userData = data.editData;
    this.userId = data.userId;
    this.accountType = data.accountType;
  }

  ngOnInit() {
    this.changeForm = this.fb.group({
      oldPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, {
      validator: MustMatch('newPassword', 'confirmPassword')
    });
  }
  get f() { return this.changeForm.controls; }
  onChange() {
    this.onShow = !this.onShow;
  }
  freezeUser(userId, param) {
    console.log(userId, this.userId, this.accountType);
    this.userService.freezeUser(this.userId, this.accountType, userId, param)
        .pipe(first())
        .subscribe(
            data => {
              this.totalUserData = data;
              for (let i = 0; i < this.totalUserData.length; i++) {
                if (this.totalUserData[i].u_id === userId) {
                  this.userData = this.totalUserData[i];
                  break;
                }
              }
            },
            error => {
            });
  }
  onSubmit(userId) {
    console.log(userId);
    if (this.changeForm.get('oldPassword').value !== this.userData.password) {
      this.changeForm.controls['oldPassword'].setErrors({notMatch: true});
    } else {
      this.changeForm.controls['oldPassword'].setErrors(null);
    }
    this.submitted = true;
    if (this.changeForm.invalid) {
      return;
    }
    this.userService.changePwd(this.f.confirmPassword.value, this.userId, this.accountType)
        .pipe(first())
        .subscribe(
            data => {
              this.userData = data;
              for (let i = 0; i < this.totalUserData.length; i++) {
                if (this.totalUserData[i].u_id === userId) {
                  this.userData = this.totalUserData[i];
                  break;
                }
              }
            },
            error => {
            });
  }
}
