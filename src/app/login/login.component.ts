import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonApiService } from '../core/services/common-api.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { CommunicateService } from '../core/services/communicate.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  public login: FormGroup;
  ispasswordshow: boolean = false;
  allRoles: any[] = [];
  isFieldValid: boolean = false;
  constructor(private fb: FormBuilder, private api: CommonApiService, private toast: ToastrService, private router: Router, private communicate: CommunicateService) {
    this.login = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    })
  }

  get field() { return this.login.controls }

  ngOnInit() {
    this.getAllRoles();
  }

  onSubmit() {
    if (this.login.invalid) {
      this.isFieldValid = true;
      return
    }
    this.communicate.isLoaderLoad.next(true);
    this.api.allPostMethod("application/login", this.login.value).subscribe((res: any) => {
      this.communicate.isLoaderLoad.next(false); 
      if (!res.error) {
        let which_role: any;
        let role_idx: any;
        let roleInfo = res['data'].roleInfo;
        if (roleInfo && roleInfo.length > 0) {
          which_role = roleInfo[0].role_master;
          role_idx = this.allRoles?.find((f: any) => f.id == which_role?.id && f.name == which_role?.name);
          if (role_idx != undefined) {
            localStorage.setItem('role', JSON.stringify(role_idx));
          }
        }

        localStorage.setItem('token', res.data['token']);
        localStorage.setItem('permissiontoken', res.data['permissions']);
        localStorage.setItem('Shared_Data', JSON.stringify({
          is_email_valid: res.data['is_email_verified'],
          temp_pass: res.data['is_tempPassword'],
          user_id: res.data['id'],
          is_owner: res.data['is_owner'],
          email_add: res['data']?.email,
          account_id: res['data']?.account_id,
        }));
        this.toast.success("Login successfully", "Valid user");
        this.login.reset();
        if (res['data']?.is_owner == true || role_idx?.name == 'Admin') {
          this.router.navigate([res['data'].is_email_verified == 0 ? '/verify-email' : (res['data'].account_id ? '/dashboard-detail' : '/create-organization')]);
        } else {
          this.router.navigate([res['data'].is_tempPassword == true ? '/password-change' : '/dashboard-detail/profile']);
        }

      } else {
        this.toast.error(res.message || res.error, "Something")
      }
    });
  }

  getAllRoles() {
    // this.api.allgetMethod('role/roles', {}).subscribe((res: any) => {
    //   if (!res['error']) {
    //     this.allRoles = res['data'];
    //     localStorage.setItem("role_list", JSON.stringify(this.allRoles));
    //   }
    // });
  }

}
