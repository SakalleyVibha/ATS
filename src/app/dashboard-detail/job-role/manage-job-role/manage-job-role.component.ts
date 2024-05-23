import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CommonApiService } from '../../../core/services/common-api.service';
import { CommunicateService } from '../../../core/services/communicate.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-manage-job-role',
  templateUrl: './manage-job-role.component.html',
  styleUrl: './manage-job-role.component.css'
})
export class ManageJobRoleComponent {
  roleForm:FormGroup;
  isFormValid:boolean = false;
  isEditForm:boolean = false;
  clientList:Array<any>= [];
  industryList: any;
  departmentList: any;
  isActive:boolean = true;
  
  constructor(private api:CommonApiService,private router:Router,private communicate:CommunicateService,private formBuild:FormBuilder,private toastr:ToastrService,private activeRouter:ActivatedRoute){
    let user_data: any = localStorage.getItem('Shared_Data');
    user_data = JSON.parse(user_data);

    this.roleForm = this.formBuild.group({
      name: new FormControl('',[Validators.required,Validators.minLength(2),Validators.pattern(/^(?!(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|EXEC|ALTER|CREATE|TRUNCATE)|(['";\\])|(\b\d+\b)|(\/\*[\s\S]*?\*\/|--.*)|(AND|OR|NOT|XOR)|\b(?:SELECT|INSERT|UPDATE|DELETE|EXEC)\s*\(|(error|exception|warning))/i)]),
      account_id: new FormControl(user_data?.account_id),
      client_id: new FormControl('',[Validators.required]),
      industry_id:new FormControl('',[Validators.required]),
      department_id:new FormControl('',[Validators.required]),
      status: new FormControl(''),
      // poc_name: new FormControl('',[Validators.required,Validators.minLength(2),Validators.pattern(/^(?!(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|EXEC|ALTER|CREATE|TRUNCATE)|(['";\\])|(\b\d+\b)|(\/\*[\s\S]*?\*\/|--.*)|(AND|OR|NOT|XOR)|\b(?:SELECT|INSERT|UPDATE|DELETE|EXEC)\s*\(|(error|exception|warning))/i)]),
      // poc_email: new FormControl('',[Validators.required,Validators.email]),
      // poc_phone: new FormControl('',[Validators.required,Validators.pattern('[6-9][0-9]{12}')]),
      // poc_mobile: new FormControl('',[Validators.required,Validators.pattern('[6-9][0-9]{12}')]),
      // poc_fax: new FormControl('',[Validators.pattern('^[0-9]*$'),Validators.minLength(10),Validators.maxLength(13)]),
      description: new FormControl('',[Validators.required,Validators.maxLength(150),Validators.pattern(/^(?!(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|EXEC|ALTER|CREATE|TRUNCATE)|(['";\\])|(\b\d+\b)|(\/\*[\s\S]*?\*\/|--.*)|(AND|OR|NOT|XOR)|\b(?:SELECT|INSERT|UPDATE|DELETE|EXEC)\s*\(|(error|exception|warning))/i)])
    });
    this.communicate.isLoaderLoad.next(true);
    this.getClientList(user_data?.account_id); 
   
    this.getEditData(user_data?.account_id);
  }

  get formData() { return this.roleForm.controls }
  

  getClientList(acc_id:any){
    this.communicate.isLoaderLoad.next(true);
    this.api.allPostMethod('clients/clientlist', { account_id: acc_id, pageNumber: 1, pageSize: 10 }).subscribe((res: any) => {
      if(res?.data.length > 0){
        this.clientList = res['data'];
      }else{
        this.clientList = [];
        // this.roleForm.controls['client_id']?.clearValidators();
        // this.roleForm.controls['client_id']?.updateValueAndValidity();
      }
      this.getIndustrialList(acc_id);
      this.communicate.isLoaderLoad.next(false);
    });
  }

  getIndustrialList(acc_id:any){
    this.communicate.isLoaderLoad.next(true);
    this.api.allPostMethod("industry/industrieslist",{account_id:acc_id,pageNumber:1,pageSize:10}).subscribe((res:any)=>{
      if(res?.data.length > 0){
        this.industryList = res.data;
      }else{
        // this.roleForm.controls['industry_id']?.clearValidators();
        // this.roleForm.controls['industry_id']?.updateValueAndValidity();
        this.industryList = [];
      }
      this.getDepartmentList(acc_id);
      this.communicate.isLoaderLoad.next(false);
    });
  }

  getDepartmentList(acc_id:any){
    this.communicate.isLoaderLoad.next(true);
    this.api.allPostMethod("departments/departmentlist",{account_id:acc_id, pageNumber: 1, pageSize: 10 }).subscribe((res:any)=>{
      if(res && res?.data.length > 0){
        this.departmentList = res['data']
      }else{
        this.departmentList = []
        // this.roleForm.controls['department_id']?.clearValidators();
        // this.roleForm.controls['department_id']?.updateValueAndValidity(); 
      }
      this.communicate.isLoaderLoad.next(false);
    })
  }

  getEditData(acc_id:number){
    this.activeRouter.queryParams.subscribe((res:any)=>{
      if(res && res?.id && res != null){
        this.isEditForm = true;
        this.communicate.isLoaderLoad.next(true);
        this.api.allPostMethod("job-role/jobRolelist",{account_id : acc_id ,id: Number(res?.id),pageNumber:1,pageSize:10}).subscribe((res:any)=>{
          console.log(res);
          let editData = res.data[0];
          this.roleForm.patchValue({
            name: editData.name,
            description: editData.description,
          });
          this.isActive = editData.status;
          this.roleForm.addControl("id",new FormControl(editData?.id));
          this.roleForm.removeControl("industry_id")
          this.roleForm.removeControl("client_id")
          this.roleForm.removeControl("department_id")
          this.communicate.isLoaderLoad.next(false);
        });
      }
    });
  }

  onSubmitForm(){
    if(this.roleForm.invalid){
      this.isFormValid = true;
      return;
    }
    this.roleForm.patchValue({
      client_id: Number(this.roleForm.value.client_id),
      industry_id: Number(this.roleForm.value.industry_id),
      department_id: Number(this.roleForm.value.department_id),
      status: Number(this.isActive)
    });
    this.communicate.isLoaderLoad.next(true);
    this.api.allPostMethod('job-role/addjobRole',this.roleForm.value).subscribe((response:any)=>{
      if(response?.message && !response.error){
        this.toastr.success("Role data added successfully","",{closeButton:true,timeOut:5000}).onHidden.subscribe(()=>{
          this.communicate.isLoaderLoad.next(false);
          this.router.navigate(['/dashboard-detail/role']);
        });
      }else{
        this.toastr.error("Something went wrong, Please try again later","",{closeButton:true,timeOut:5000}).onHidden.subscribe(()=>{
          this.communicate.isLoaderLoad.next(false);
        });
      }
    })
  }

  onEditForm(){
    if(this.roleForm.invalid){
      this.isFormValid = true
      return
    }
    this.roleForm.patchValue({
      status: Number(this.isActive)
    })
    this.communicate.isLoaderLoad.next(true);
    this.api.allPostMethod("job-role/updatejobRole",this.roleForm.value).subscribe((res:any)=>{
      if(res.data[0] == true){
        this.toastr.success("Role update successfully","",{closeButton:true,timeOut:5000}).onHidden.subscribe(()=>{
          this.communicate.isLoaderLoad.next(false);
          this.router.navigate(['dashboard-detail/role']);
        });
      }else{
        this.toastr.error("Something went wrong,Please try again later","",{closeButton:true,timeOut:5000}).onHidden.subscribe(()=>{
          this.communicate.isLoaderLoad.next(false);
        });
      }
    })
  }
}
