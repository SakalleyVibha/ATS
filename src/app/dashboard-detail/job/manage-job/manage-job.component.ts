import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CommonApiService } from '../../../core/services/common-api.service';
import { CommunicateService } from '../../../core/services/communicate.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-manage-job',
  templateUrl: './manage-job.component.html',
  styleUrl: './manage-job.component.css'
})
export class ManageJobComponent {

  jobForm!: FormGroup;
  getAllList: any;
  location_list: any[] = [];
  currentClientList: any[] = [];
  currentIndustryList: any[] = [];
  currentDepartmentList: any[] = [];
  currentRoleList: any[] = [];

  constructor(private api: CommonApiService, private communicate: CommunicateService, private toastr: ToastrService, private fb: FormBuilder) {
    this.getAllList = {
      location: [],
      client: [],
      industry: [],
      department: [],
      role: []
    }
    let user_data: any = localStorage.getItem('Shared_Data');
    user_data = JSON.parse(user_data);
    this.generateJobForm();
    this.getAllLocation(user_data.account_id);
    this.getAllClient(user_data.account_id);
    this.getIndustryList(user_data.account_id);
    this.getDepartmentList(user_data.account_id);
    this.getRoleList(user_data.account_id);
  }

  generateJobForm() {
    this.jobForm = this.fb.group({
      location_id: ['', [Validators.required]],
      client_id: ['', [Validators.required]],
      industry_id: ['', [Validators.required]],
      department_id: ['', [Validators.required]],
    });
  }

  getAllLocation(acc_id: number) {
    this.communicate.isLoaderLoad.next(true);
    this.api.allPostMethod('locations/locationlist', { account_id: acc_id, pageNumber: 1, pageSize: 50 }).subscribe((res: any) => {
      if (res.data && res.data.length > 0) {
        this.getAllList['location'] = res.data;
      } else {
        this.getAllList['location'] = [];
      }
      this.communicate.isLoaderLoad.next(false);
    });
  }

  getAllClient(acc_id: number) {
    this.communicate.isLoaderLoad.next(true);
    this.api.allPostMethod('clients/clientlist', { account_id: acc_id, pageNumber: 1, pageSize: 50 }).subscribe((res: any) => {
      if (res.data && res.data.length > 0) {
        this.getAllList['client'] = res.data;
      } else {
        this.getAllList['client'] = []
      }
      this.communicate.isLoaderLoad.next(false);
    });
  }

  getIndustryList(acc_id: number) {
    this.communicate.isLoaderLoad.next(true);
    this.api.allPostMethod("industry/industrieslist", { account_id: acc_id, pageNumber: 1, pageSize: 50 }).subscribe((res: any) => {
      if (res?.data.length > 0) {
        this.getAllList['industry'] = res.data;
      } else {
        this.getAllList['industry'] = [];
      }
      this.communicate.isLoaderLoad.next(false);
    });
  }

  getDepartmentList(acc_id: number) {
    this.communicate.isLoaderLoad.next(true);
    this.api.allPostMethod("departments/departmentlist", { account_id: acc_id, pageNumber: 1, pageSize: 50 }).subscribe((res: any) => {
      if (res?.['data'].length > 0) {
        this.getAllList['department'] = res['data']
      } else {
        this.getAllList['department'] = []
      }
      this.communicate.isLoaderLoad.next(false);
    })
  }

  getRoleList(acc_id: number) {
    this.communicate.isLoaderLoad.next(true);
    this.api.allPostMethod("job-role/jobRolelist", { account_id: acc_id, pageNumber: 1, pageSize: 50 }).subscribe((res: any) => {
      if (res?.data.length > 0) {
        this.getAllList['role'] = res?.data;
      } else {
        this.getAllList['role'] = [];
      }
      this.communicate.isLoaderLoad.next(false);
    });
  }

  selectLocation(event: any) {
    console.log("event : ", event.target.value);
    this.currentClientList = this.getAllList['client'].filter((data: any) => data.location_id == event.target.value);
  }

  selectClient(event: any) {
    console.log("event : ", event.target.value);
    this.currentIndustryList = this.getAllList['industry'].filter((data: any) => data.client_id == event.target.value);
  }

  selectIndustry(event: any) {
    console.log("event : ", event.target.value);
    this.currentDepartmentList = this.getAllList['department'].filter((data: any) => data.industry_id == event.target.value);
  }

  selectDepartment(event: any) {
    console.log("event : ", event.target.value);
    this.currentRoleList = this.getAllList['role'].filter((data: any) => data.department_id == event.target.value);
  }
}
