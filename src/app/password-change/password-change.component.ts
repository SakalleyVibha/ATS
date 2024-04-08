import { Component } from '@angular/core';
import { AbstractControlOptions, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CommonApiService } from '../core/services/common-api.service';
import { Router } from '@angular/router';
import { ConfirmedValidator } from '../shared/confirm.validator';

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

  constructor(private fb: FormBuilder, private toast: ToastrService, private commonApi: CommonApiService, private router: Router) {
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

  resetPassword() {
    let formData = Object.assign({}, this.changeTempPasswordForm.value);
    delete formData.confirmpassword
    this.commonApi.allPostMethod('users/changeUsersPassword', formData).subscribe((res: any) => {
      console.log("After Change Password : ", res);
      if (res.message) {
        this.isPasswordReset = true;
        this.toast.success("Password updated successfully", "Done", {
          closeButton: true,
          timeOut: 2000
        }).onHidden.subscribe(() => {
          localStorage.clear();
          this.router.navigate(['/login']);
        });
      } else {
        this.toast.error("Unable to update password try again later.", "Something went wrong", { closeButton: true, timeOut: 500 }).onHidden.subscribe(() => {
          this.changeTempPasswordForm.reset();
        });
      }
    });
  }

}
