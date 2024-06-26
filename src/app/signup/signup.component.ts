import { Component, signal } from '@angular/core';
import { AbstractControlOptions, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmedValidator } from '../shared/confirm.validator';
import { CommonApiService } from '../core/services/common-api.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { CommunicateService } from '../core/services/communicate.service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {

  signUp: FormGroup;
  isFormValid: boolean = false;
  ispasswordshow: boolean = false;
  isconfrmpassshow: boolean = false;
  maxDOB: any;
  number_validation = signal(environment.Phone_Mobile_valid);

  constructor(private fb: FormBuilder, private api: CommonApiService, private toastr: ToastrService, private router: Router, private communicate: CommunicateService) {
    this.signUp = this.fb.group({
      f_name: ['', [Validators.required, Validators.minLength(2)]],
      l_name: ['', [Validators.required, Validators.minLength(2)]],
      alias: ['', [Validators.required]],
      dob: ['', [Validators.required]],

      email: ['', [Validators.required, Validators.email]],
      website: ['', [Validators.required, Validators.pattern('(^((http|https)://)|((www)[.]))[A-Za-z0-9_@./#!$%^:*&+-]+([\-\.]{1}[a-z0-9]+)*\.(?:com|net|in|org|io)$')]],
      phone: ['', [Validators.required, Validators.pattern(this.number_validation())]],
      mobile: ['', [Validators.required, Validators.pattern(this.number_validation())]],
      fax: ['', [, Validators.pattern('^[0-9]*$'), Validators.minLength(10), Validators.maxLength(13)]],

      street: ['', [Validators.required]],
      city: ['', [Validators.required]],
      country: ['', [Validators.required]],
      state: ['', [Validators.required]],
      zip: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(6)]],
      password: ['', [Validators.required, Validators.pattern('(?=[A-Za-z0-9@#$%^&+!=]+$)^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@#$%^&+!=]).*$'), Validators.minLength(8)]],
      confirmpassword: ['', [Validators.required]],
    },
      {
        validator: ConfirmedValidator
      } as AbstractControlOptions)
  }

  ngOnInit() {
    let date = new Date();
    let today = date.getDate();
    this.maxDOB = `${date.getFullYear()}-${date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1}-${date.getDate() < 10 ? `0${today}` : `${today}`}`;
    this.signUp.get('password')?.valueChanges.subscribe((res) => {
      let cnfrmPass = this.signUp.value?.confirmpassword;
      if (cnfrmPass != '' && cnfrmPass == res) {
        this.signUp.controls['confirmpassword']?.updateValueAndValidity();
      }
    });
  }

  get formField() { return this.signUp.controls }

  submitSignUp() {
    if (this.signUp.invalid) {
      this.isFormValid = true;
      return;
    }
    this.communicate.isLoaderLoad.next(true);
    let date = this.convertDate(this.signUp.value.dob);
    this.signUp.patchValue({ dob: date });
    const formCopy = Object.assign({}, this.signUp.getRawValue());
    delete formCopy.confirmpassword;
    let payload = { ...formCopy, dob: date };
    console.log("PayLoad : ", payload);
    this.api.allPostMethod("users/signup", payload).subscribe((res: any) => {
      this.communicate.isLoaderLoad.next(false);
      if (res['error'] != true) {
        this.toastr.success("Sign up done successfully", "")
        this.router.navigate(['/login']);
      } else {
        this.toastr.error(res['message'], "")
      }
    });
  }

  convertDate(dateString: string) {
    var parts = dateString.split("-");
    var newParts = [parts[1], parts[2], parts[0]];
    var newDateString = newParts.join("-");
    return newDateString;
  }
}
