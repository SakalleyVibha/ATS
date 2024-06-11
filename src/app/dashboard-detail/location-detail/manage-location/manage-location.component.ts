import { Component, ViewChild, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CommonApiService } from '../../../core/services/common-api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommunicateService } from '../../../core/services/communicate.service';
import { environment } from '../../../../environments/environment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-manage-location',
  templateUrl: './manage-location.component.html',
  styleUrl: './manage-location.component.css'
})
export class ManageLocationComponent {
  @ViewChild('imageModal') content: any;
  addLocationForm: FormGroup;
  isFormValid = signal(false);
  editLocation: boolean = false;
  logoName: string = '';
  imgURLBase64 = signal<ArrayBuffer | any>('');
  isActive: boolean = true;
  sql_validation = signal(environment.SQL_validation);
  website_validate = signal(environment.website_validation);
  number_validation = signal(environment.Phone_Mobile_valid);
  modalRef: any;
  selectedFileName: string = '';

  constructor(private api: CommonApiService, private formBuilder: FormBuilder, private router: Router, private activatedRoute: ActivatedRoute, private toastr: ToastrService, private communicate: CommunicateService, private modalService: NgbModal) {
    this.addLocationForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      about: ['', [Validators.required, Validators.maxLength(150)]],
      account_id: '',
      website: ['', [Validators.required, Validators.pattern(this.website_validate())]],
      phone: ['', [Validators.required, , Validators.pattern(this.number_validation())]],
      mobile: ['', [Validators.required, Validators.pattern(this.number_validation())]],
      fax: ['', [Validators.pattern('^[0-9]*$'), Validators.minLength(10), Validators.maxLength(13)]],
      street: ['', [Validators.required]],
      city: ['', [Validators.required]],
      country: ['', [Validators.required]],
      state: ['', [Validators.required]],
      zip: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6), Validators.pattern('^[0-9]*$')]],
      logo: ['', [Validators.required]],
      status: ['']
    });

  }

  ngOnInit() {
    let id: number;
    let localData: any = localStorage.getItem('Shared_Data');
    localData = JSON.parse(localData);
    this.addLocationForm.patchValue({
      account_id: localData.account_id
    });
    this.activatedRoute.queryParams.subscribe((paramMap: any) => {
      id = paramMap.id;
      if (id != null && id != undefined) {
        this.editLocation = true;
        this.communicate.isLoaderLoad.next(true);
        this.api.allPostMethod("locations/getlocation", { id: Number(id), account_id: localData?.account_id }).subscribe((res: any) => {
          this.communicate.isLoaderLoad.next(false);
          if (res['error'] != true) {
            let editableData = res['data'];
            this.addLocationForm.patchValue({
              name: editableData?.name,
              about: editableData?.about,
              account_id: editableData?.account_id,
              website: editableData?.website,
              phone: editableData?.phone,
              mobile: editableData?.mobile,
              fax: editableData?.fax,
              street: editableData?.street,
              city: editableData?.city,
              country: editableData?.country,
              state: editableData?.state,
              zip: editableData?.zip,
            });
            this.isActive = editableData?.status;
            this.imgURLBase64.set(editableData?.logo);
            this.addLocationForm.controls['logo'].clearValidators();
            this.addLocationForm.controls['logo'].updateValueAndValidity();
            this.addLocationForm.setControl('id', new FormControl(id));

          }
        });
      }
    });

  }

  get formData() { return this.addLocationForm.controls }

  onSubmit() {
    if (this.addLocationForm.invalid) {
      this.isFormValid.set(true);
      return;
    }
    this.communicate.isLoaderLoad.next(true);
    this.addLocationForm.get('status')?.patchValue(Number(this.isActive));
    let payload = { ...this.addLocationForm.value, logo: this.imgURLBase64() };
    this.api.allPostMethod("locations/location", payload).subscribe((resp_location: any) => {
      this.communicate.isLoaderLoad.next(false);
      if (resp_location['error'] != true) {
        this.addLocationForm.reset();
        let isSkip: any = localStorage.getItem('isDashboardDetail');
        if (!JSON.parse(isSkip)) {
          let payLoad = { account_id: this.addLocationForm.value.account_id, pageNumber: 1, pageSize: 10 };
          this.getUserListCall(payLoad);
          this.toastr.success("Location added succesfully", "");
        } else {
          this.communicate.isDetailSideShow.next(true);
          this.router.navigate(['/dashboard-detail/location-detail']);
        }
      } else {
        this.toastr.error(resp_location['message'], "")
        this.communicate.isLoaderLoad.next(false);
      }
    });
  }

  onEditForm() {
    if (this.addLocationForm.invalid) {
      this.isFormValid.set(true);
      return;
    }
    this.communicate.isLoaderLoad.next(true);
    this.addLocationForm.get('status')?.patchValue(Number(this.isActive));
    let isBase64 = this.communicate.isBase64(this.imgURLBase64());
    let payload = { ...this.addLocationForm.value, logo: (isBase64 ? this.imgURLBase64() : false) };

    this.api.allPostMethod("locations/updatelocation", payload).subscribe((updateLocationResponse: any) => {
      this.communicate.isLoaderLoad.next(false);
      if (updateLocationResponse['error'] != true) {
        this.router.navigate(['/dashboard-detail/location-detail']);
        this.toastr.success("Location updated", "")
      } else {
        this.toastr.error("Location not updated, Please try again later !", "")
      }
    });
  }

  convertImageToBase64(file_event: any) {
    const reader = new FileReader();
    reader.readAsDataURL(file_event);
    reader.onload = () => {
      this.imgURLBase64.set(reader.result)
    };
  }

  CrossBtn() {
    this.imgURLBase64.set('');
    this.addLocationForm.get('logo')?.setValue('');
    this.addLocationForm.controls['logo'].addValidators(Validators.required);
    this.addLocationForm.controls['logo'].updateValueAndValidity();
  }

  onFileChange(event: any) {
    // console.log(event.target.files[0]?.name);
    this.selectedFileName = event.target.files[0]?.name;
    if (event.dataTransfer) {
      let file = event.dataTransfer.files
      this.addLocationForm.controls['logo'].clearValidators();
      this.addLocationForm.controls['logo'].updateValueAndValidity();
      this.convertImageToBase64(file[0]);
      return
    }
    if (event.srcElement && event.srcElement != undefined) {
      let file = event.srcElement.files
      this.convertImageToBase64(file[0]);
    }
  }

  viewImagePopup() {
    this.modalRef = this.modalService.open(this.content, { centered: true, size: 'sm', backdrop: 'static', keyboard: false });  // Open the modal with template reference

    // Handle modal dismiss reason (optional)
  }

  closeModal() {
    if (this.modalRef) {
      this.modalRef.dismiss('cross click'); // Dismiss the modal
    }
  }

  getUserListCall(payload: any) {
    this.api.allPostMethod("users/getUserList", payload).subscribe({
      next: (res: any) => {
        let userList = res.data || [];
        userList = userList.filter((v: any) => !v.is_owner);
        if (!userList.length) {
          this.router.navigate(['dashboard-detail', 'user-detail']);
        } else {
          this.communicate.isDetailSideShow.next(true);
          this.router.navigate(['/dashboard-detail/location-detail']);
        }
      }
    })
  }
}
