import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CommonApiService } from '../../core/services/common-api.service';
import { ToastrService } from 'ngx-toastr';
import { CommunicateService } from '../../core/services/communicate.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm!: FormGroup;
  isSubmitted = false;
  ispasswordshow = false;

  constructor(
    private fb: FormBuilder,
    private api: CommonApiService,
    private toastr: ToastrService,
    private communicate: CommunicateService,
    private router: Router
  ){
     this.loginForm = fb.group({
      email : ['',[Validators.required,Validators.email]],
      password: ['',[Validators.required,Validators.minLength(8)]]
     })
  }
  
  get ctrl(){ 
    return this.loginForm.controls;
  }

  onSubmit(){
    if(this.loginForm.invalid){
      this.isSubmitted = true
      return 
    }
    this.communicate.isLoaderLoad.next(true);
    let formVal = this.loginForm.value;
    let payload = {
      email: formVal.email,
      password: formVal.password
    }
    this.api.allPostMethod('superadmin/login',payload).subscribe({
      next: (res:any)=>{
        if(!res.error){
          localStorage.setItem('supertoken',res.data['token']);
          localStorage.setItem('superdetails',JSON.stringify(res.data))
          this.toastr.success('login successfully', "", { timeOut: 500 }).onHidden.subscribe(() => {
            this.communicate.isLoaderLoad.next(false);
            this.router.navigate(['super-admin/dashboard'])
          });
        }else{
          this.toastr.error(res.message || res.error, "", { timeOut: 3000 }).onHidden.subscribe(() => {
            this.communicate.isLoaderLoad.next(false);
          });
        }
      }
    })

  }
}
