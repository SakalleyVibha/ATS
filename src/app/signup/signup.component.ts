import { Component } from '@angular/core';
import { AbstractControlOptions, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmedValidator } from '../shared/confirm.validator';
import { CommonApiService } from '../core/services/common-api.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {

  signUp: FormGroup

  constructor(private fb: FormBuilder, private api: CommonApiService) {
    this.signUp = this.fb.group({
      f_name: ['', [Validators.required, Validators.minLength(2)]],
      l_name: ['', [Validators.required, Validators.minLength(2)]],
      alias: ['', [Validators.required]],
      dob: ['', [Validators.required]],

      email: ['', [Validators.required, Validators.email]],
      website: [''],
      phone: ['', [Validators.required, Validators.pattern('[6-9][0-9]{12}')]],
      mobile: ['', [Validators.required, Validators.pattern('[6-9][0-9]{12}')]],
      fax: [''],

      street: ['', [Validators.required]],
      city: ['', [Validators.required]],
      country: ['', [Validators.required]],
      state: ['', [Validators.required]],
      zip: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]],
      password: ['', [Validators.required, Validators.pattern('(?=[A-Za-z0-9@#$%^&+!=]+$)^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@#$%^&+!=]).*$'), Validators.minLength(8)]],
      confirmpassword: ['', [Validators.required]],
    },
      {
        validator: ConfirmedValidator
      } as AbstractControlOptions)
  }

  get formField() { return this.signUp.controls }

  submitSugnUp() {
    // let date = moment(this.signUp.value.dob).format("DD-MM-yyyy");
    let date = this.convertDate(this.signUp.value.dob);
    this.signUp.patchValue({ dob: date });
    const formCopy = Object.assign({}, this.signUp.getRawValue());
    delete formCopy.confirmpassword;
    // this.successDone = true
    this.api.allPostMethod("users/signup", formCopy).subscribe((res: any) => {
      console.log(res);
      if (!res.error) {
      }
      // this.isMessageShow.pipe(
      //   delay(2000)
      //   ).subscribe(()=>{
      //     this.successDone = false
      //   });
      //   this.signUp.reset();
      // }
      // });
    })
  }

  convertDate(dateString: string) {
    var parts = dateString.split("-");
    var newParts = [parts[1], parts[2], parts[0]];
    var newDateString = newParts.join("-");
    return newDateString;
  }
}
