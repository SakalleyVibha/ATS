import { Component } from '@angular/core';
import { CommonApiService } from '../../../core/services/common-api.service';
import { CommunicateService } from '../../../core/services/communicate.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-manage-department',
  templateUrl: './manage-department.component.html',
  styleUrl: './manage-department.component.css'
})
export class ManageDepartmentComponent {
  departmentForm: FormGroup;
  isFormValid: boolean = false;
  clientList: any;
  industryList: any;
  isForEdit: boolean = false;

  constructor(private api: CommonApiService, private communicate: CommunicateService, private router: Router, private toastr: ToastrService, private activeRoute: ActivatedRoute, private FormBuild: FormBuilder) {
    let shareData: any = localStorage.getItem("Shared_Data");
    shareData = JSON.parse(shareData);
    this.departmentForm = this.FormBuild.group({
      name: new FormControl('', [Validators.required, Validators.minLength(2), Validators.pattern(/^(?!(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|EXEC|ALTER|CREATE|TRUNCATE)|(['";\\])|(\b\d+\b)|(\/\*[\s\S]*?\*\/|--.*)|(AND|OR|NOT|XOR)|\b(?:SELECT|INSERT|UPDATE|DELETE|EXEC)\s*\(|(error|exception|warning))/i)]),
      client_id: new FormControl('', [Validators.required]),
      industry_id: new FormControl('', [Validators.required]),
      account_id: new FormControl(shareData.account_id),
      poc_name: new FormControl('', [Validators.required, Validators.minLength(2), Validators.pattern(/^(?!(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|EXEC|ALTER|CREATE|TRUNCATE)|(['";\\])|(\b\d+\b)|(\/\*[\s\S]*?\*\/|--.*)|(AND|OR|NOT|XOR)|\b(?:SELECT|INSERT|UPDATE|DELETE|EXEC)\s*\(|(error|exception|warning))/i)]),
      poc_email: new FormControl('', [Validators.required, Validators.email]),
      poc_phone: new FormControl('', [Validators.required, Validators.pattern('[6-9][0-9]{12}')]),
      poc_mobile: new FormControl('', [Validators.required, Validators.pattern('[6-9][0-9]{12}')]),
      poc_fax: new FormControl('', [Validators.minLength(10), Validators.maxLength(13), Validators.pattern('^[0-9]*$')]),
      description: new FormControl('', [Validators.required, Validators.maxLength(150), Validators.pattern(/^(?!(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|EXEC|ALTER|CREATE|TRUNCATE)|(['";\\])|(\b\d+\b)|(\/\*[\s\S]*?\*\/|--.*)|(AND|OR|NOT|XOR)|\b(?:SELECT|INSERT|UPDATE|DELETE|EXEC)\s*\(|(error|exception|warning))/i)])
    });
    this.getClientList(shareData.account_id);
    this.getEditData(shareData.account_id);
  }

  get formData() { return this.departmentForm.controls }

  ngOnInit() { }

  getClientList(acc_id: any) {
    this.communicate.isLoaderLoad.next(true);
    this.api.allPostMethod("clients/clientlist", { account_id: acc_id, pageNumber: 1, pageSize: 10 }).subscribe((res: any) => {
      if (res?.data.length > 0) {
        this.clientList = res.data;
      } else {
        this.clientList = [];
      }
      this.communicate.isLoaderLoad.next(false);
    });
    this.getIndustryList(acc_id);
  }

  getIndustryList(acc_id: any) {
    this.communicate.isLoaderLoad.next(true);
    this.api.allPostMethod("industry/industrieslist", { account_id: acc_id, pageNumber: 1, pageSize: 10 }).subscribe((res: any) => {
      if (res?.data.length > 0) {
        this.industryList = res.data;
      } else {
        this.industryList = [];
      }
      this.communicate.isLoaderLoad.next(false);
    });
  }

  onSubmitForm() {
    if (this.departmentForm.invalid) {
      this.isFormValid = true;
      return
    }
    this.departmentForm.patchValue({
      client_id: Number(this.departmentForm.value.client_id),
      industry_id: Number(this.departmentForm.value.industry_id)
    })
    this.communicate.isLoaderLoad.next(true);
    this.api.allPostMethod("departments/department", this.departmentForm.value).subscribe((res: any) => {
      if (!res.error) {
        this.toastr.success("Department created successfully", "", { closeButton: true}).onHidden.subscribe(() => {
          this.communicate.isLoaderLoad.next(false)
          this.router.navigate(['dashboard-detail/department']);
        });
      } else {
        this.toastr.error("Something went wrong,Try again later", "", { closeButton: true}).onHidden.subscribe(() => {
          this.communicate.isLoaderLoad.next(false);
        })
      }
    })
  }

  getEditData(acc_id: number) {
    this.activeRoute.queryParams.subscribe((res: any) => {
      if (res.id && res.id != null && res.id != undefined) {
        this.isForEdit = true
        this.api.allPostMethod("departments/departmentlist", { account_id: acc_id, id: Number(res?.id), pageNumber: 1, pageSize: 10 }).subscribe((res: any) => {
          let editData = res.data[0];
          this.departmentForm.patchValue({
            name: editData.name,
            poc_name: editData.poc_name,
            poc_email: editData.poc_email,
            poc_phone: editData.poc_phone,
            poc_mobile: editData.poc_mobile,
            poc_fax: editData.poc_fax,
            description: editData.description,
          });
          this.departmentForm.addControl("id",new FormControl(editData?.id));
          this.departmentForm.removeControl("client_id");
          this.departmentForm.removeControl("industry_id");
        });
      }
    })
  }

  onEditForm() {
    if (this.departmentForm.invalid) {
      this.isFormValid = true;
      return
    }
    this.communicate.isLoaderLoad.next(true);
    this.api.allPostMethod("departments/updatedepartment",this.departmentForm.value).subscribe((res:any)=>{
      if(res.data[0] == true){
        this.toastr.success("Department update successfully","",{closeButton:true}).onHidden.subscribe(()=>{
          this.communicate.isLoaderLoad.next(false);
          this.router.navigate(['dashboard-detail/department']);
        })
      }else{
        this.toastr.error("Something went wrong,Please try again later","",{closeButton:true}).onHidden.subscribe(()=>{
          this.communicate.isLoaderLoad.next(false);
        })
      }
    });
  }
}
