import { Component, signal } from '@angular/core';
import { CommonApiService } from '../../../core/services/common-api.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { CommunicateService } from '../../../core/services/communicate.service';
import { environment } from '../../../../environments/environment';
@Component({
  selector: 'app-manage-client',
  templateUrl: './manage-client.component.html',
  styleUrl: './manage-client.component.css'
})
export class ManageClientComponent {

  client_Form: FormGroup;
  isFieldsValid = signal<boolean>(false);
  location_list = signal<Array<any>>([])
  imgURLBase64 = signal<ArrayBuffer | any>('');
  clientEdit = signal(false);
  isActive = signal(true);
  sql_validation = signal(environment.SQL_validation);
  website_validate = signal(environment.website_validation);
  number_validation = signal(environment.Phone_Mobile_valid);

  constructor(private api: CommonApiService, private formbuilder: FormBuilder, private router: Router, private toastr: ToastrService, private activeRouter: ActivatedRoute, private communicate: CommunicateService) {
    let shareData: any = localStorage.getItem("Shared_Data");
    shareData = JSON.parse(shareData);
    // this.client_Form.value.account_id = shareData.account_id;
    this.client_Form = this.formbuilder.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      website: ['', [Validators.required, Validators.pattern(this.website_validate())]],
      logo: ['', [Validators.required]],
      mobile: ['', [Validators.required, Validators.pattern(this.number_validation())]],
      phone: ['', [Validators.required, Validators.pattern(this.number_validation())]],
      fax: ['', [Validators.pattern('^[0-9]*$'), Validators.minLength(10), Validators.maxLength(13)]],
      about: ['', [Validators.required, Validators.maxLength(150)]],

      street: ['', [Validators.required]],
      state: ['', [Validators.required]],
      city: ['', [Validators.required]],
      zip: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6), Validators.pattern('^[0-9]*$')]],
      country: ['', [Validators.required]],

      location_id: [''],
      account_id: Number(shareData.account_id),
      status: Number(this.isActive())
    });
    this.getLocationList(shareData.account_id);
    this.editClientData(shareData.account_id);
  }

  get formData() { return this.client_Form.controls }

  ngOnInit() {

  }

  getLocationList(acc_id: number) {
    this.communicate.isLoaderLoad.next(true);
    this.api.allPostMethod('locations/locationlist', { account_id: acc_id, pageNumber: 1, pageSize: 20 }).subscribe((res: any) => {
      if (res['data']) {
        this.location_list.set(res['data']);
        this.client_Form.controls['location_id']?.setValidators([Validators.required]);
        this.client_Form.controls['location_id'].updateValueAndValidity();
      }
      this.communicate.isLoaderLoad.next(false);
    });
  }

  editClientData(acc_id: any) {
    this.activeRouter.queryParams.subscribe((isClientId: any) => {
      let id_param = isClientId.id;
      if (id_param != null || id_param != undefined) {
        this.clientEdit.set(true);
        let data = {
          id: Number(id_param),
          account_id: acc_id
        };
        this.communicate.isLoaderLoad.next(true);
        this.api.allPostMethod("clients/getclient", data).subscribe((res: any) => {
          let editableData = res['data'];
          console.log(editableData);
          this.client_Form.patchValue({
            name: editableData?.name,
            about: editableData?.about,
            website: editableData?.website,
            phone: editableData?.phone,
            mobile: editableData?.mobile,
            fax: editableData?.fax,
            street: editableData?.street,
            city: editableData?.city,
            country: editableData?.country,
            state: editableData?.state,
            zip: editableData?.zip,
            account_id: acc_id
          });
          this.isActive.set(editableData?.status);
          this.imgURLBase64.set(editableData?.logo);
          if (this.imgURLBase64()) {
            this.client_Form.controls['logo'].removeValidators(Validators.required);
          }
          // this.client_Form.removeControl("account_id");
          this.client_Form.removeControl('location_id');
          this.client_Form.addControl('id', new FormControl(editableData?.id));
          // this.client_Form.addControl('account_id', new FormControl(acc_id));
          this.communicate.isLoaderLoad.next(false);
        });
      }
    });
  }

  onSubmit() {
    if (this.client_Form.invalid) {
      this.isFieldsValid.set(true);
      return
    }
    this.communicate.isLoaderLoad.next(true);
    // this.client_Form.patchValue({
    //   location_id: Number(this.client_Form.value.location_id),
    //   status: Number(this.isActive()),
    // })
    let payload = {
      ...this.client_Form.value,
      logo: this.imgURLBase64(),
      status: Number(this.isActive()),
      location_id: Number(this.client_Form.value.location_id)
    }

    this.api.allPostMethod("clients/client", payload).subscribe((afterAdd: any) => {
      if (afterAdd.message) {
        this.client_Form.reset();
        this.toastr.success("Client created successfully", "", { closeButton: true, timeOut: 5000 }).onHidden.subscribe(() => {
          this.communicate.isLoaderLoad.next(false);
          this.router.navigate(['/dashboard-detail/client-detail']);
        })
      } else {
        this.toastr.error("Something went wrong, Try again later", "", { closeButton: true, timeOut: 5000 }).onHidden.subscribe(() => {
          this.communicate.isLoaderLoad.next(false);
        });
      }
    });
  }

  onEditClient() {
    if (this.client_Form.invalid) {
      this.isFieldsValid.set(true);
      return;
    }
    this.communicate.isLoaderLoad.next(true);
    let isBase64 = this.communicate.isBase64(this.imgURLBase64());

    let payload = { ...this.client_Form.value, logo: (isBase64 ? this.imgURLBase64() : false), status: Number(this.isActive()) }
    this.api.allPostMethod("clients/updateclient", payload).subscribe((res: any) => {
      if (res && res.message) {
        this.toastr.success("Client update successfully !!", "", { closeButton: true, timeOut: 5000 }).onHidden.subscribe(() => {
          this.communicate.isLoaderLoad.next(false);
          this.router.navigate(['/dashboard-detail/client-detail']);
        });
      } else {
        this.toastr.error("Something went wrong. Try again later", "", { closeButton: true, timeOut: 5000 }).onHidden.subscribe(() => {
          this.communicate.isLoaderLoad.next(false);
        });
      }
    })
  }

  convertImageToBase64(file_event: any) {
    const reader = new FileReader();
    reader.readAsDataURL(file_event);
    reader.onload = async () => {
      this.imgURLBase64.set(reader.result);
    };
  }

  CrossBtn() {
    this.imgURLBase64.set('');
    this.client_Form.get('logo')?.setValue('');
    this.client_Form.controls['logo'].addValidators(Validators.required);
    this.client_Form.controls['logo'].updateValueAndValidity();
  }

  onFileChange(event: any) {
    if (event.dataTransfer) {
      let file = event.dataTransfer.files
      this.client_Form.controls['logo'].removeValidators(Validators.required);
      this.client_Form.controls['logo'].updateValueAndValidity();
      this.convertImageToBase64(file[0]);
      return
    }
    if (event.srcElement && event.srcElement != undefined) {
      let file = event.srcElement.files
      this.convertImageToBase64(file[0]);
    }
  }
}
