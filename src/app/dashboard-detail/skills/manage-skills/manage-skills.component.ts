import { Component, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CommunicateService } from '../../../core/services/communicate.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonApiService } from '../../../core/services/common-api.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-manage-skills',
  templateUrl: './manage-skills.component.html',
  styleUrl: './manage-skills.component.css'
})
export class ManageSkillsComponent {

  skillForm: FormGroup
  reqObj: any
  formValid = signal(false);
  location_list = signal<any>([]);
  client_list = signal<any>([]);
  sql_validation = signal(environment.SQL_validation);

  constructor(private api: CommonApiService, private formbuild: FormBuilder, private communicate: CommunicateService, private toastr: ToastrService, private router: Router, private activeroute: ActivatedRoute) {
    let userData: any = localStorage.getItem('Shared_Data');
    userData = JSON.parse(userData)
    this.skillForm = this.formbuild.group({
      name: new FormControl('', [Validators.required, Validators.minLength(2)]),
      description: new FormControl('', [Validators.required, Validators.maxLength(150)]),
      account_id: new FormControl(userData?.account_id),
      location_id: new FormControl('', Validators.required),
      client_id: new FormControl('', Validators.required)
    });
    this.reqObj = {
      account_id: userData?.account_id,
      pageNumber: 1,
      pageSize: 10
    }
    this.getLocationId();
    this.getClientId();
  }

  get formData() { return this.skillForm.controls }

  getLocationId() {
    this.communicate.isLoaderLoad.next(true);
    this.api.allPostMethod('locations/locationlist', this.reqObj).subscribe((res: any) => {
      if (res['error'] != true) {
        if (res['data'] && res['data'].length > 0) {
          // if(this.reqObj.pageNumber == 1){
          this.location_list.set(res['data']);
          // } else 
          // this.location_list.push(...res['data']);          
          // this.totalPages = res['totalPages'];
        } else {
          // this.location_list = [];
        }
      }
      this.communicate.isLoaderLoad.next(false);
    })
  }

  getClientId() {
    this.communicate.isLoaderLoad.next(true);
    this.api.allPostMethod('clients/clientlist', this.reqObj).subscribe((res: any) => {
      this.communicate.isLoaderLoad.next(false);
      // if (res['error'] != true) {
      //   if ((res['data'] && res['data'].length > 0)) {
      //     if(this.reqObj.pageNumber == 1){
      // this.clientList = res['data'];
      this.client_list.set(res['data']);
      // } else
      // // this.clientList.push(...res['data']);
      // this.client_list.update(x=>{
      //   return [...x,res['data']]
      // })
      //   console.log(this.client_list());
      //   this.client_list = res['totalPages'];
      // } else {
      //   this.client_list.set([]);
      // }
      // }
    });
  }

  onSubmit() {
    if (this.skillForm.invalid) {
      this.formValid.set(true);
      return;
    }
    this.communicate.isLoaderLoad.next(true);
    let payload = {
      ...this.skillForm.value,
      location_id: Number(this.skillForm.value.location_id),
      client_id: Number(this.skillForm.value.client_id)
    }
    this.api.allPostMethod("skill/skill", payload).subscribe((res: any) => {
      if (res['message']) {
        this.toastr.success("Skill added successfully", "", { closeButton: true, timeOut: 5000 }).onHidden.subscribe(() => {
          this.communicate.isLoaderLoad.next(false);
          this.router.navigate(['dashboard-detail/skills']);
        });
      } else {
        this.toastr.error("Something went wrong", "", { closeButton: true, timeOut: 5000 }).onHidden.subscribe(() => {
          this.communicate.isLoaderLoad.next(false);
        });
      }
    });
  }

}
