import { Component, EventEmitter, Output, ViewEncapsulation } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-wizard-page',
  templateUrl: './wizard.component.html',
  styleUrls: [ './styles/_forms-wizard.scss' ],
  encapsulation: ViewEncapsulation.None
})
export class WizardPageComponent {

  // Output for passing the submited form data along
  @Output() formData = new EventEmitter<any>();

  formSubmitted = false;

  // Form
  form: FormGroup;

  // Forms and active state for each step
  steps = [
    { form: undefined, current: true },
    { form: undefined, current: false },
    { form: undefined, current: false }
  ];

  // The current visible step
  currentStep = 0;

  // Progress var init
  progress = '0';

  // Checkbox images for step 2
  optionsImages = [
    { img: '../../../../assets/imgs/forms-wizard/followers.png', value: 'followers'},
    { img: '../../../../assets/imgs/forms-wizard/login.png', value: 'login'},
    { img: '../../../../assets/imgs/forms-wizard/places.jpg', value: 'places'},
    { img: '../../../../assets/imgs/forms-wizard/profile.png', value: 'profile'}
  ];

  // Validation error messages
  validationMessages = {
    images: [
      { type: 'required', message: 'Select at least one option.' }
    ],
    description: [
      { type: 'required', message: 'Description is required.' }
    ],
    firstName: [
      { type: 'required', message: 'First name is required.' }
    ],
    email: [
      { type: 'required', message: 'Email is required.' },
      { type: 'email', message: 'Enter a valid email.' }
    ],
    budget: [
      { type: 'pattern', message: 'The budget must be an integer number.' }
    ]
  };

  constructor(fb: FormBuilder) {

    // Init for the form groups in each step of the wizard
    this.steps[0].form = new FormGroup(
      {
        firstName: new FormControl('', Validators.required),
        lastName: new FormControl(''),
        email: new FormControl('', Validators.compose([Validators.email, Validators.required]))
      }
    );

    this.steps[1].form = new FormGroup({
      description: new FormControl('', Validators.required),
      framework: new FormControl(''),
      language: new FormControl(''),
      bootstrap: new FormControl(''),
      budget: new FormControl('', Validators.pattern('[0-9]*'))
    });

    this.steps[2].form = new FormGroup(
      { images: new FormArray([]) },
      (a: FormArray) => { // Check if there is at least one image selected
        return a.controls['images'].controls.length > 0 ? undefined : { required : true };
      }
    );

    // Init the Main form with all the form groups of all the steps
    this.form = fb.group({
      step0FormGroup: this.steps[0].form,
      step1FormGroup: this.steps[1].form,
      step2FormGroup: this.steps[2].form
    });
  }

  // Checkboxes values for step 2
  multiOptionsChange(option: string, isChecked: boolean): void {
    const step = this.form.controls.step2FormGroup as FormGroup;
    const optionFormArray = step.controls.images as FormArray;
    optionFormArray.markAsTouched();
    if (isChecked) {
      optionFormArray.push(new FormControl(option));
    } else {
      const index = optionFormArray.controls.findIndex(x => x.value === option);
      optionFormArray.removeAt(index);
    }
  }

  // Change step function, to be called on the 'submission' of each step
  // 'change' indicates the length of the step
  changeStep(change: number): void {
    if (!this.formSubmitted) {
      // If we want to move forwards (change > 0) the previous steps must be valid
      change = this.validateSteps(this.currentStep, change);
      this.steps[this.currentStep].current = false;
      this.currentStep += change;
      this.steps[this.currentStep].current = true;
      this.progress = (Math.floor((this.currentStep / (this.steps.length - 1)) * 100)).toString();
    }
  }

  goToStep(step): void {
    this.changeStep(step - this.currentStep);
  }

  validateSteps(currentStep, change): number {
    for (let i = currentStep; i < (currentStep + change); i++) {
      if (!this.steps[i].form.valid) {
        // Mark the step as touched so the errors messages are shown
        this.steps[currentStep].form.markAsTouched();
        for (const control in this.steps[currentStep].form.controls) {
          if (this.steps[currentStep].form.controls.hasOwnProperty(control)) {
            this.steps[currentStep].form.controls[control].markAsTouched();
          }
        }

        return(change = i - currentStep);
      }
    }

    return (change);
  }

  // On submit to be called by the form submission
  doSubmit(): void {
    let data = {};
    if (this.validateSteps(this.currentStep, 1) === 1) {
      for (const formGroup in this.form.value) { // Get all the steps data together
        if (Object.prototype.hasOwnProperty.call(this.form.value, formGroup)) {
          const formData = this.form.value[formGroup].value;
          data = Object.assign(data, formData);
        }
      }
      this.formData.emit(data); // Emit the complete data set
      this.progress = '100'; // Update the progress bar
      this.currentStep++;
      this.formSubmitted = true;
    }
  }

  finish(): void {
    // console.log('Wizard finished!');
  }
}
