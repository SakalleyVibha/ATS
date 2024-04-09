import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonApiService } from '../core/services/common-api.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  public login: FormGroup;
  ispasswordshow: boolean = false;
  allRoles: any[] = [];

  constructor(private fb: FormBuilder, private api: CommonApiService, private toast: ToastrService, private router: Router) {
    this.login = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    })
  }

  get field() { return this.login.controls }

  ngOnInit() {
    this.getAllRoles();
  }

  onSubmit() {

    this.api.allPostMethod("application/login", this.login.value).subscribe((res: any) => {
      if (!res.error) {
        let which_role: any;
        let role_idx: any;
        let roleInfo = res['data'].roleInfo;
        // if (roleInfo && roleInfo.length > 0) {
        //   which_role = roleInfo[0].role_master;
        //   role_idx = this.allRoles.find((f: any) => f.id == which_role.id && f.name == which_role.name);
        //   if (role_idx != undefined) {
        //     localStorage.setItem('role', JSON.stringify(role_idx));
        //   }
        // }

        localStorage.setItem('role', JSON.stringify({
          id: 1, name: "Admin"
        }));
        localStorage.setItem('token', res.data['token']);
        localStorage.setItem('Shared_Data', JSON.stringify({
          is_email_valid: res.data['is_email_verified'],
          temp_pass: res.data['is_tempPassword'],
          user_id: res.data['id'],
          is_owner: res.data['is_owner'],
          email_add: res['data'].email,
          account_id: res['data']?.account_id
        }));
        this.toast.success("Login successfully", "Valid user", { timeOut: 500, closeButton: true }).onHidden.subscribe(() => {
          this.login.reset();
          if (res['data'].is_owner == true || role_idx.name == 'Admin') {
            this.router.navigate([res['data'].is_email_verified == 0 ? '/verify-email' : (res['data'].account_id ? '/create-user-location' : '/create-organization')]);
          } else {
            this.router.navigate([res['data'].is_tempPassword == false ? '/password-change' : '/dashboard-detail']);
          }
        });

      } else {
        this.toast.error(res.error, "Something", { timeOut: 1000 });
      }
    });
  }

  getAllRoles() {
    this.api.allgetMethod('role/roles',{}).subscribe((res: any) => {
      if (!res['error']) {
        this.allRoles = res['data'];
      }
    });
  }

}
