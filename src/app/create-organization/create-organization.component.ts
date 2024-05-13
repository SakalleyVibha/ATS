import { Component, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CommonApiService } from '../core/services/common-api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommunicateService } from '../core/services/communicate.service';
@Component({
  selector: 'app-create-organization',
  templateUrl: './create-organization.component.html',
  styleUrl: './create-organization.component.css'
})
export class CreateOrganizationComponent {

  organizationForm: FormGroup;
  isFieldsValid = signal<boolean>(false)
  forEdit = signal(false)
  imgURLBase64 = signal<ArrayBuffer | any>(new ArrayBuffer(10));

  constructor(private formBuild: FormBuilder, private router: Router, private toastr: ToastrService, private serviceApi: CommonApiService, private communicate: CommunicateService, private activerouter: ActivatedRoute) {
    this.organizationForm = this.formBuild.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.pattern(/^(?!(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|EXEC|ALTER|CREATE|TRUNCATE)|(['";\\])|(\b\d+\b)|(\/\*[\s\S]*?\*\/|--.*)|(AND|OR|NOT|XOR)|\b(?:SELECT|INSERT|UPDATE|DELETE|EXEC)\s*\(|(error|exception|warning))/i)]],
      about: ['', [Validators.required, Validators.maxLength(150), Validators.pattern(/^(?!(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|EXEC|ALTER|CREATE|TRUNCATE)|(['";\\])|(\b\d+\b)|(\/\*[\s\S]*?\*\/|--.*)|(AND|OR|NOT|XOR)|\b(?:SELECT|INSERT|UPDATE|DELETE|EXEC)\s*\(|(error|exception|warning))/i)]],
      website: ['', [Validators.required, Validators.pattern('(^((http|https)://)|((www)[.]))[A-Za-z0-9_@./#!$%^:*&+-]+([\-\.]{1}[a-z0-9]+)*\.(?:com|net|in|org|io)$')]],
      phone: ['', [Validators.required, Validators.pattern('[6-9][0-9]{12}')]],
      mobile: ['', [Validators.required, Validators.pattern('[6-9][0-9]{12}')]],
      fax: ['', [Validators.pattern('^[0-9]*$'), Validators.minLength(10), Validators.maxLength(13)]],
      street: ['', [Validators.required, Validators.pattern(/^(?!(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|EXEC|ALTER|CREATE|TRUNCATE)|(['";\\])|(\b\d+\b)|(\/\*[\s\S]*?\*\/|--.*)|(AND|OR|NOT|XOR)|\b(?:SELECT|INSERT|UPDATE|DELETE|EXEC)\s*\(|(error|exception|warning))/i)]],
      city: ['', [Validators.required, Validators.pattern(/^(?!(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|EXEC|ALTER|CREATE|TRUNCATE)|(['";\\])|(\b\d+\b)|(\/\*[\s\S]*?\*\/|--.*)|(AND|OR|NOT|XOR)|\b(?:SELECT|INSERT|UPDATE|DELETE|EXEC)\s*\(|(error|exception|warning))/i)]],
      country: ['', [Validators.required, Validators.pattern(/^(?!(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|EXEC|ALTER|CREATE|TRUNCATE)|(['";\\])|(\b\d+\b)|(\/\*[\s\S]*?\*\/|--.*)|(AND|OR|NOT|XOR)|\b(?:SELECT|INSERT|UPDATE|DELETE|EXEC)\s*\(|(error|exception|warning))/i)]],
      state: ['', [Validators.required, Validators.pattern(/^(?!(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|EXEC|ALTER|CREATE|TRUNCATE)|(['";\\])|(\b\d+\b)|(\/\*[\s\S]*?\*\/|--.*)|(AND|OR|NOT|XOR)|\b(?:SELECT|INSERT|UPDATE|DELETE|EXEC)\s*\(|(error|exception|warning))/i)]],
      zip: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6), Validators.pattern('^[0-9]*$')]],
      logo: ['', [Validators.required]]
    });
  }

  get formData() { return this.organizationForm.controls }

  ngOnInit() {
    this.activerouter.queryParams.subscribe((response: any) => {
      let id = response.id
      if (id != null && id != undefined) {
        this.communicate.isLoaderLoad.next(true);
        this.forEdit.update(value => !value)
        this.serviceApi.allgetMethod('accounts/account', {}).subscribe((res: any) => {
          let accountDetail = res['data'].find((data: any) => data.id == id);
          console.log(accountDetail);
          this.organizationForm.patchValue({
            name: accountDetail?.name,
            about: accountDetail?.about,
            website: accountDetail?.website,
            phone: accountDetail?.phone,
            mobile: accountDetail?.mobile,
            fax: accountDetail?.fax,
            street: accountDetail?.street,
            city: accountDetail?.city,
            country: accountDetail?.country,
            state: accountDetail?.state,
            zip: accountDetail?.zip,
          })
          this.imgURLBase64.set(accountDetail?.logo);
          this.organizationForm.setControl('id', new FormControl(id));
          this.communicate.isLoaderLoad.next(false);
        })
      }
    })
  }

  onSubmit() {
    if (this.organizationForm.invalid) {
      this.isFieldsValid.set(true);
      return
    }
    this.communicate.isLoaderLoad.next(true);
    let payload = { ...this.organizationForm.value, logo: this.imgURLBase64 }
    this.serviceApi.allPostMethod("accounts/account", payload).subscribe((response: any) => {
      let shareData: any = localStorage.getItem('Shared_Data');
      shareData = JSON.parse(shareData);
      shareData.account_id = response['data']?.id;
      localStorage.setItem("Shared_Data", JSON.stringify(shareData));
      if (response.message) {
        this.organizationForm.reset();
        this.toastr.success("Form Submitted", "", { closeButton: true, timeOut: 5000 }).onHidden.subscribe(() => {
          this.communicate.isLoaderLoad.next(false);
          this.router.navigate(['/create-user-location']);
        });
      } else {
        this.toastr.error("Something went wrong", "", { timeOut: 5000, closeButton: true }).onHidden.subscribe(() => {
          this.communicate.isLoaderLoad.next(false);
        });
      }
    });
  }

  onEdit(){
    if(this.organizationForm.invalid){
      this.isFieldsValid.set(true);
      return;
    }
    this.communicate.isLoaderLoad.next(true);
    let payload = { ...this.organizationForm.value, logo: this.imgURLBase64() }
    this.serviceApi.allPostMethod("accounts/updadteAccount", payload).subscribe((response: any) => {
     if (response.message) {
        this.organizationForm.reset();
        this.toastr.success("Form Submitted", "", { closeButton: true, timeOut: 5000 }).onHidden.subscribe(() => {
          this.communicate.isLoaderLoad.next(false);
          this.router.navigate(['/dashboard-detail']);
        });
      } else {
        this.toastr.error("Something went wrong", "", { timeOut: 5000, closeButton: true }).onHidden.subscribe(() => {
          this.communicate.isLoaderLoad.next(false);
        });
      }
    });
  }

  convertImageToBase64(file_event: any) {
    const reader = new FileReader();
    reader.readAsDataURL(file_event);
    reader.onload = () => {
      // this.imgURLBase64 = reader.result
      this.imgURLBase64.update(value => value = reader.result)
    };
    this.organizationForm.controls['logo'].updateValueAndValidity();
  }
  
  CrossBtn() {
    // this.imgURLBase64 = '';
    this.imgURLBase64.set('');
    this.organizationForm.get('logo')?.setValue('');
    this.organizationForm.controls['logo'].addValidators(Validators.required);
    this.organizationForm.controls['logo'].updateValueAndValidity();
  }

  onFileChange(event:any){
    if(event.dataTransfer){
      let file = event.dataTransfer.files;
      this.organizationForm.controls['logo'].removeValidators(Validators.required);
      this.organizationForm.controls['logo'].updateValueAndValidity();
      this.convertImageToBase64(file[0]);
      return
    }
    if(event.srcElement && event.srcElement!= undefined){
      let file = event.srcElement.files;
      this.convertImageToBase64(file[0]);
    }
  }
}
