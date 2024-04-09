import { Component } from '@angular/core';
import { AbstractControlOptions, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmedValidator } from '../shared/confirm.validator';
import { CommonApiService } from '../core/services/common-api.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {

  signUp: FormGroup;
  isFormValid:boolean = false;
  ispasswordshow: boolean = false;
  isconfrmpassshow:boolean = false;
  maxDOB: any;

  constructor(private fb: FormBuilder, private api: CommonApiService,private toastr:ToastrService,private router:Router) {
    this.signUp = this.fb.group({
      f_name: ['', [Validators.required, Validators.minLength(2), Validators.pattern(/^(?!(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|EXEC|ALTER|CREATE|TRUNCATE)|(['";\\])|(\b\d+\b)|(\/\*[\s\S]*?\*\/|--.*)|(AND|OR|NOT|XOR)|\b(?:SELECT|INSERT|UPDATE|DELETE|EXEC)\s*\(|(error|exception|warning))/i)]],
      l_name: ['', [Validators.required, Validators.minLength(2), Validators.pattern(/^(?!(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|EXEC|ALTER|CREATE|TRUNCATE)|(['";\\])|(\b\d+\b)|(\/\*[\s\S]*?\*\/|--.*)|(AND|OR|NOT|XOR)|\b(?:SELECT|INSERT|UPDATE|DELETE|EXEC)\s*\(|(error|exception|warning))/i)]],
      alias: ['', [Validators.required, Validators.pattern(/^(?!(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|EXEC|ALTER|CREATE|TRUNCATE)|(['";\\])|(\b\d+\b)|(\/\*[\s\S]*?\*\/|--.*)|(AND|OR|NOT|XOR)|\b(?:SELECT|INSERT|UPDATE|DELETE|EXEC)\s*\(|(error|exception|warning))/i)]],
      dob: ['', [Validators.required]],

      email: ['', [Validators.required, Validators.email]],
      website: ['',[Validators.required, Validators.pattern('(^((http|https)://)|((www)[.]))[A-Za-z0-9_@./#!$%^:*&+-]+([\-\.]{1}[a-z0-9]+)*\.(?:com|net|in|org|io)$')]],
      phone: ['', [Validators.required, Validators.pattern('[6-9][0-9]{12}')]],
      mobile: ['', [Validators.required, Validators.pattern('[6-9][0-9]{12}')]],
      fax: ['',[,Validators.pattern('^[0-9]*$'), Validators.minLength(10), Validators.maxLength(13)]],

      street: ['', [Validators.required, Validators.pattern(/^(?!(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|EXEC|ALTER|CREATE|TRUNCATE)|(['";\\])|(\b\d+\b)|(\/\*[\s\S]*?\*\/|--.*)|(AND|OR|NOT|XOR)|\b(?:SELECT|INSERT|UPDATE|DELETE|EXEC)\s*\(|(error|exception|warning))/i)]],
      city: ['', [Validators.required, Validators.pattern(/^(?!(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|EXEC|ALTER|CREATE|TRUNCATE)|(['";\\])|(\b\d+\b)|(\/\*[\s\S]*?\*\/|--.*)|(AND|OR|NOT|XOR)|\b(?:SELECT|INSERT|UPDATE|DELETE|EXEC)\s*\(|(error|exception|warning))/i)]],
      country: ['', [Validators.required, Validators.pattern(/^(?!(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|EXEC|ALTER|CREATE|TRUNCATE)|(['";\\])|(\b\d+\b)|(\/\*[\s\S]*?\*\/|--.*)|(AND|OR|NOT|XOR)|\b(?:SELECT|INSERT|UPDATE|DELETE|EXEC)\s*\(|(error|exception|warning))/i)]],
      state: ['', [Validators.required, Validators.pattern(/^(?!(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|EXEC|ALTER|CREATE|TRUNCATE)|(['";\\])|(\b\d+\b)|(\/\*[\s\S]*?\*\/|--.*)|(AND|OR|NOT|XOR)|\b(?:SELECT|INSERT|UPDATE|DELETE|EXEC)\s*\(|(error|exception|warning))/i)]],
      zip: ['', [Validators.pattern('^[0-9]*$'),Validators.required, Validators.minLength(6), Validators.maxLength(6)]],
      password: ['', [Validators.required, Validators.pattern('(?=[A-Za-z0-9@#$%^&+!=]+$)^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@#$%^&+!=]).*$'), Validators.minLength(8)]],
      confirmpassword: ['', [Validators.required]],
    },
      {
        validator: ConfirmedValidator
      } as AbstractControlOptions)
  }

  ngOnInit(){
    let date = new Date();
    this.maxDOB = `${date.getFullYear()}-${date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1}-${date.getDate() < 10 ? `0${date.getDate() - 1}` : date.getDate() - 1}`;
     this.signUp.get('password')?.valueChanges.subscribe( (res) =>{
      let cnfrmPass = this.signUp.value?.confirmpassword;
      if(cnfrmPass != '' && cnfrmPass == res){
        this.signUp.controls['confirmpassword']?.updateValueAndValidity();
      }
    });
  }

  get formField() { return this.signUp.controls }

  submitSignUp() {
    if(this.signUp.invalid){
      this.isFormValid = true;
      return;
    }
    let date = this.convertDate(this.signUp.value.dob);
    this.signUp.patchValue({ dob: date });
    const formCopy = Object.assign({}, this.signUp.getRawValue());
    delete formCopy.confirmpassword;

    this.api.allPostMethod("users/signup", formCopy).subscribe((res: any) => {
      if (!res.error) {
        this.toastr.success("Sign up done successfully","",{timeOut:5000,closeButton:true}).onHidden.subscribe(()=>{
          this.router.navigate(['/login']);
        });
      }else{
        this.toastr.error("Something went wrong, Please try again later","",{closeButton:true,timeOut:5000});
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
