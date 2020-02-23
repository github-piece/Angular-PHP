import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MustMatch} from '../../../_helpers/must-match';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {UserService} from '../../../_services/user/user.service';
import {first} from 'rxjs/operators';

@Component({
  selector: 'app-create-modal',
  templateUrl: './create-modal.component.html',
  styles: []
})
export class CreateModalComponent implements OnInit {
  createForm: FormGroup;
  submitted = false;
  type: any;
  val: any;
  id: any;
  avatar = 'mse/uploaded/avatar/default.png';
  file: File = null;
  imagePath: any;
  userPhoto: any;
  uploadImageShow = false;
  path = 'mse/uploaded/avatar/';
  constructor(
      private fb: FormBuilder,
      private dialogRef: MatDialogRef<CreateModalComponent>,
      private userService: UserService,
      @Inject(MAT_DIALOG_DATA) data
  ) {
    this.type = data.type;
    this.val = data.val;
    this.id = data.id;
  }

  ngOnInit() {
    this.createForm = this.fb.group({
      userName: ['', Validators.required],
      userEmail: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, {
      validator: MustMatch('password', 'confirmPassword')
    });
  }
  get f() { return this.createForm.controls; }
  onSubmit() {
    this.submitted = true;
    if (this.createForm.invalid) {
      return;
    }
    const formData =  new FormData();
    formData.append('name', this.f.userName.value);
    formData.append('email', this.f.userEmail.value);
    formData.append('password', this.f.password.value);
    formData.append('file', this.file);
    formData.append('action', 'create');
    formData.append('adminId', this.id);
    this.userService.createUser(formData)
        .subscribe(
            data => {
            });
    this.dialogRef.close();
  }
  close() {
    this.dialogRef.close();
  }
  preview(event) {
    const mimeType = event.files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }
    const reader = new FileReader();
    this.imagePath = event.files;
    reader.readAsDataURL(event.files[0]);
    reader.onload = (_event) => {
      this.userPhoto = reader.result;
    };
    this.file = event.files.item(0);
    this.uploadImageShow = true;

    // const formData = new FormData();
    // formData.append('file', this.file);
    // formData.append('action', 'newUpload');
    // this.userService.uploadPhoto(formData)
    //     .pipe(first())
    //     .subscribe( data => {
    //         }
    //     );
  }
}
