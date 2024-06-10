import { Component, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CommonApiService } from '../core/services/common-api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommunicateService } from '../core/services/communicate.service';
import { environment } from '../../environments/environment';
@Component({
  selector: 'app-create-organization',
  templateUrl: './create-organization.component.html',
  styleUrl: './create-organization.component.css'
})
export class CreateOrganizationComponent {

  organizationForm: FormGroup;
  isFieldsValid = signal<boolean>(false)
  forEdit = signal(false)
  imgURLBase64 = signal<ArrayBuffer | any>('');
  number_validation = signal(environment.Phone_Mobile_valid);

  constructor(private formBuild: FormBuilder, private router: Router, private toastr: ToastrService, private serviceApi: CommonApiService, private communicate: CommunicateService, private activerouter: ActivatedRoute) {
    this.organizationForm = this.formBuild.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      about: ['', [Validators.required, Validators.maxLength(150)]],
      website: ['', [Validators.required, Validators.pattern('(^((http|https)://)|((www)[.]))[A-Za-z0-9_@./#!$%^:*&+-]+([\-\.]{1}[a-z0-9]+)*\.(?:com|net|in|org|io)$')]],
      phone: ['', [Validators.required, Validators.pattern(this.number_validation())]],
      mobile: ['', [Validators.required, Validators.pattern(this.number_validation())]],
      fax: ['', [Validators.pattern('^[0-9]*$'), Validators.minLength(10), Validators.maxLength(13)]],
      street: ['', [Validators.required]],
      city: ['', [Validators.required]],
      country: ['', [Validators.required]],
      state: ['', [Validators.required]],
      zip: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6), Validators.pattern('^[0-9]*$')]],
      logo: ['', [Validators.required]]
    });
  }

  get formData() { return this.organizationForm.controls }

  ngOnInit() {
    this.activerouter.queryParams.subscribe((response: any) => {
      let id = response.id
      if (id != null && id != undefined) {
        this.setAccountValues(id);
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
      if (response['error'] != true) {
        let shareData: any = localStorage.getItem('Shared_Data');
        shareData = JSON.parse(shareData);
        shareData.account_id = response['data']?.id;
        this.importRoles(response['data']?.id);
        localStorage.setItem("Shared_Data", JSON.stringify(shareData));
        this.organizationForm.reset();
        this.toastr.success("Form Submitted", "").onHidden.subscribe(() => {
          this.communicate.isLoaderLoad.next(false);
          localStorage.setItem('isLocatioCreated', JSON.stringify(false));
          this.router.navigate(['dashboard-detail', 'location-detail']);
        });
      } else {
        this.toastr.error(response['message'], "").onHidden.subscribe(() => {
          this.communicate.isLoaderLoad.next(false);
        });
      }
    });
  }

  onEdit() {
    if (this.organizationForm.invalid) {
      this.isFieldsValid.set(true);
      return;
    }
    this.communicate.isLoaderLoad.next(true);
    let payload = { ...this.organizationForm.value, logo: this.imgURLBase64() }
    this.serviceApi.allPostMethod("accounts/updadteAccount", payload).subscribe((response: any) => {
      this.communicate.isLoaderLoad.next(false);
      if (response['error'] != true) {
        this.organizationForm.reset();
        this.toastr.success("Form Submitted", "")
        this.router.navigate(['/dashboard-detail']);
      } else {

        this.toastr.error(response['message'], "");
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

  onFileChange(event: any) {
    if (event.dataTransfer) {
      let file = event.dataTransfer.files;
      this.organizationForm.controls['logo'].removeValidators(Validators.required);
      this.organizationForm.controls['logo'].updateValueAndValidity();
      this.convertImageToBase64(file[0]);
      return
    }
    if (event.srcElement && event.srcElement != undefined) {
      let file = event.srcElement.files;
      this.convertImageToBase64(file[0]);
    }
  }

  importRoles(accountId: number) {
    this.communicate.isLoaderLoad.next(true);
    this.serviceApi.allPostMethod("accountrole/assignrole", { account_id: accountId }).subscribe((response: any) => {
      this.communicate.isLoaderLoad.next(false);
      console.log('response: ', response);

    });
  }

  setAccountValues(id: any) {
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
}
