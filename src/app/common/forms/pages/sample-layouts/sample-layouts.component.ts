import { Component, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-sample-layouts-page',
  templateUrl: './sample-layouts.component.html',
  styleUrls: [ './styles/sample-layouts.scss' ],
  encapsulation: ViewEncapsulation.None
})
export class SampleLayoutsPageComponent {
  formStacked: FormGroup;
  formHorizontal: FormGroup;
  formRegister: FormGroup;
  formLogin: FormGroup;


  constructor(fb: FormBuilder) {
    this.formStacked = fb.group({
      email: new FormControl(''),
      password: new FormControl(''),
      newsletter: new FormControl(true)
    });
    this.formHorizontal = fb.group({
      email: new FormControl(''),
      password: new FormControl(''),
      remember: new FormControl(true)
    });
    this.formRegister = fb.group({
      email: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
      cpassword: new FormControl('', Validators.required),
      newsletter: new FormControl(true)
    });
    this.formLogin = fb.group({
      email: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required)
    });
  }
}
