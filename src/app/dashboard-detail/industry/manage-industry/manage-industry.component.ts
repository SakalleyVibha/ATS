import { Component } from '@angular/core';
import { CommonApiService } from '../../../core/services/common-api.service';
import { ToastrService } from 'ngx-toastr';
import { CommunicateService } from '../../../core/services/communicate.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-manage-industry',
  templateUrl: './manage-industry.component.html',
  styleUrl: './manage-industry.component.css'
})
export class ManageIndustryComponent {
  industryForm: FormGroup;
  clientList: any;
  isFormValid: Boolean = false;
  isEditForm: boolean = false;
  isActive: boolean = true;
  paginationData = {
    account_Id: 0,
    keyword: '',
    pageNumber: 1,
    pageSize: 10
  }

  constructor(private router: Router, private api: CommonApiService, private activeRouter: ActivatedRoute, private toastr: ToastrService, private communication: CommunicateService, private formBuild: FormBuilder) {
    let shareData: any = localStorage.getItem("Shared_Data");
    shareData = JSON.parse(shareData);
    this.paginationData.account_Id = shareData?.account_id;

    this.industryForm = this.formBuild.group({
      account_id: new FormControl(shareData?.account_id),
      name: new FormControl('', [Validators.required, Validators.minLength(2)]),
      client_id: new FormControl('', [Validators.required]),
      poc_name: new FormControl('', [Validators.required, Validators.minLength(2)]),
      poc_email: new FormControl('', [Validators.required, Validators.email]),
      status: new FormControl(''),
      poc_phone: new FormControl('', [Validators.required, Validators.pattern('[6-9][0-9]{12}')]),
      poc_mobile: new FormControl('', [Validators.required, Validators.pattern('[6-9][0-9]{12}')]),
      poc_fax: new FormControl('', [Validators.minLength(10), Validators.maxLength(13), Validators.pattern('^[0-9]*$')]),
      description: new FormControl('', [Validators.required, Validators.maxLength(150)])
    });
    this.getClientList();
    this.forEditData();
  }

  ngOnInit() { }

  forEditData() {
    this.activeRouter.queryParams.subscribe((isClientId: any) => {
      if (isClientId.id != null || isClientId.id != undefined) {
        this.isEditForm = true;
        this.api.allPostMethod("industry/industrieslist", { account_id: this.paginationData.account_Id, id: Number(isClientId.id), pageNumber: this.paginationData.pageNumber, pageSize: this.paginationData.pageSize }).subscribe((res: any) => {
          let editData = res['data'][0];
          this.industryForm.patchValue({
            account_id: editData?.id,
            name: editData?.name,
            poc_name: editData?.poc_name,
            poc_email: editData?.poc_email,
            poc_phone: editData?.poc_phone,
            poc_mobile: editData?.poc_mobile,
            poc_fax: editData?.poc_fax,
            description: editData?.description,
          });
          this.isActive = editData.status;
          this.industryForm.addControl('id', new FormControl(editData?.id));
          this.industryForm.removeControl('client_id');
        });
      }
    })
  }

  getClientList() {
    this.communication.isLoaderLoad.next(true);
    this.api.allPostMethod('clients/clientlist', { account_id: this.paginationData.account_Id, pageNumber: this.paginationData.pageNumber, pageSize: this.paginationData.pageSize }).subscribe((res: any) => {
      if (res.error == true) {
        this.clientList = [];
      } else {
        this.clientList = res['data'];
      }
      this.communication.isLoaderLoad.next(false);
    });
  }

  get formData() { return this.industryForm.controls }

  onSubmitForm() {
    if (this.industryForm.invalid) {
      this.isFormValid = true;
      return
    }
    this.industryForm.patchValue({
      client_id: Number(this.industryForm.value.client_id),
      status: Number(this.isActive)
    });
    console.log(this.industryForm.value);
    this.communication.isLoaderLoad.next(true);
    this.api.allPostMethod("industry/industries", this.industryForm.value).subscribe((res: any) => {
      if (!res.error) {
        this.toastr.success("Industry added successfully", "", { closeButton: true, timeOut: 5000 }).onHidden.subscribe(() => {
          this.communication.isLoaderLoad.next(false);
          this.router.navigate(['dashboard-detail/industry']);
        })
      } else {
        this.toastr.error("Something went wrong, Please try again later", "", { closeButton: true, timeOut: 5000 }).onHidden.subscribe(() => {
          this.communication.isLoaderLoad.next(false);
        })
      }
    });
  }

  onEditForm() {
    if (this.industryForm.invalid) {
      this.isFormValid = true;
      return
    }
    this.industryForm.patchValue({
      status: Number(this.isActive)
    })
    this.communication.isLoaderLoad.next(true);
    this.api.allPostMethod("industry/updateindustries", this.industryForm.value).subscribe((res: any) => {
      if (res.error) {
        this.toastr.error("Something went wrong,Please try again later", "", { closeButton: true, timeOut: 5000 }).onHidden.subscribe(() => {
          this.communication.isLoaderLoad.next(false);
        });
      } else {
        this.toastr.success("Industry update successfully", "", { closeButton: true, timeOut: 5000 }).onHidden.subscribe(() => {
          this.communication.isLoaderLoad.next(false);
          this.router.navigate(['dashboard-detail/industry']);
        })
      }
    })
  }
}
