import { Component } from '@angular/core';
import { AbstractControlOptions, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CommonApiService } from '../core/services/common-api.service';
import { Router } from '@angular/router';
import { ConfirmedValidator } from '../shared/confirm.validator';
import { CommunicateService } from '../core/services/communicate.service';
@Component({
  selector: 'app-password-change',
  templateUrl: './password-change.component.html',
  styleUrl: './password-change.component.css'
})
export class PasswordChangeComponent {

  changeTempPasswordForm: any;
  isconfirmpasswordshow: boolean = false;
  ispasswordshow: boolean = false;
  isPasswordReset: boolean = false;
  isFieldsValid: boolean = false;

  constructor(private fb: FormBuilder, private toast: ToastrService, private commonApi: CommonApiService, private router: Router, private communicate: CommunicateService) {
    let shareData: any = localStorage.getItem('Shared_Data');
    shareData = JSON.parse(shareData);
    this.changeTempPasswordForm = this.fb.group({
      id: Number(shareData?.user_id),
      password: ['', [Validators.required, Validators.minLength(8), Validators.pattern("(?=[A-Za-z0-9@#$%^&+!=]+$)^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@#$%^&+!=]).*$")]],
      confirmpassword: ['', [Validators.required]]
    }, {
      validator: ConfirmedValidator
    } as AbstractControlOptions);
  }

  get formData() { return this.changeTempPasswordForm.controls }

  ngOnInit() {
    this.changeTempPasswordForm.get('password')?.valueChanges.subscribe((res: any) => {
      let cnfrmPass = this.changeTempPasswordForm.value?.confirmpassword;
      if (cnfrmPass != '' && cnfrmPass == res) {
        this.changeTempPasswordForm.controls['confirmpassword']?.updateValueAndValidity();
      }
    });
  }

  resetPassword() {
    if (this.changeTempPasswordForm.invalid) {
      this.isFieldsValid = true;
      return;
    }
    this.communicate.isLoaderLoad.next(true);
    let formData = Object.assign({}, this.changeTempPasswordForm.value);
    delete formData.confirmpassword
    this.commonApi.allPostMethod('users/changeUsersPassword', formData).subscribe((res: any) => {
      this.changeTempPasswordForm.reset();
      if (res.message) {
        this.isPasswordReset = true;
        this.toast.success("Password updated successfully", "", {
          closeButton: true,
          timeOut: 5000
        }).onHidden.subscribe(() => {
          localStorage.clear();
          this.communicate.isLoaderLoad.next(false)
          this.router.navigate(['/login']);
        });
      } else {
        this.toast.error("Something went wrong, Unable to update password try again later.", "", { closeButton: true, timeOut: 5000 }).onHidden.subscribe(() => {
          this.communicate.isLoaderLoad.next(false)
          this.changeTempPasswordForm.reset();
        });
      }
    });
  }

}
