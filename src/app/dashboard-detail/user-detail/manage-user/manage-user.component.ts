import { Component, ViewChild, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CommonApiService } from '../../../core/services/common-api.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { CommunicateService } from '../../../core/services/communicate.service';
import { environment } from '../../../../environments/environment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-manage-user',
  templateUrl: './manage-user.component.html',
  styleUrl: './manage-user.component.css'
})
export class ManageUserComponent {
  @ViewChild('imageModal') content: any;
  userForm!: FormGroup;
  isFormValid = signal(false);
  user_roles: any = [];
  user_location: any;
  client_list: any;
  maxDOB: any;
  editUser: boolean = false;
  selected_details: any;
  isActive: boolean = true;
  sql_validation = signal(environment.SQL_validation);
  website_validate = signal(environment.website_validation);
  number_validation = signal(environment.Phone_Mobile_valid);
  imgURLBase64 = signal<ArrayBuffer | any>('');
  modalRef: any;
  selectedFileName: string = '';

  constructor(private formBuild: FormBuilder, private api: CommonApiService, private router: Router, private toastr: ToastrService, private activeRouter: ActivatedRoute, private communicate: CommunicateService, private modalService: NgbModal) {
    let user_data: any = localStorage.getItem('Shared_Data');
    user_data = JSON.parse(user_data);

    this.selected_details = {
      role: 1,
      location: 0
    }
    this.userForm = this.formBuild.group({
      f_name: new FormControl('', [Validators.required, Validators.minLength(2)]),
      l_name: new FormControl('', [Validators.required, Validators.minLength(2)]),
      alias: new FormControl('', [Validators.required]),
      dob: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      website: new FormControl('', [Validators.required, Validators.pattern(this.website_validate())]),
      phone: new FormControl('', [Validators.required, Validators.pattern(this.number_validation())]),
      mobile: new FormControl('', [Validators.required, Validators.pattern(this.number_validation())]),
      fax: new FormControl('', [Validators.minLength(10), Validators.pattern('^[0-9]*$'), Validators.maxLength(13)]),
      profile_img: ['', [Validators.required]],
      street: new FormControl('', [Validators.required]),
      city: new FormControl('', [Validators.required]),
      country: new FormControl('', [Validators.required]),
      state: new FormControl('', [Validators.required]),
      zip: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(6), Validators.pattern('^[0-9]*$')]),
      role_id: new FormControl('', [Validators.required]),
      account_id: new FormControl(user_data.account_id),
      location_id: new FormControl(''),
      client_id: new FormControl(''),
      status: new FormControl('')
    });

    this.getUserRole(user_data.account_id);
    this.forEditData(user_data.account_id);
  }

  get formData() { return this.userForm.controls }

  ngOnInit() {
    let date = new Date();
    let today = date.getDate();
    this.maxDOB = `${date.getFullYear()}-${date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1}-${date.getDate() < 10 ? `0${today - 1}` : `${today - 1}`}`;
  }

  selectRole(event: any) {
    console.log('selectRole event: ', event.target.value);
    this.selected_details.role = event.target.value;
    if (event.target.value == 2 && (this.user_location && this.user_location.length > 0)) {
      this.userForm.controls['location_id'].setValidators([Validators.required])
      this.userForm.controls['location_id'].updateValueAndValidity()
    } else if (event.target.value == 3 && (this.client_list && this.client_list.length > 0)) {
      this.userForm.controls['client_id'].setValidators([Validators.required])
      this.userForm.controls['client_id'].updateValueAndValidity()
    } else if (this.client_list && this.client_list.length == 0) {
      this.userForm.controls['client_id'].removeValidators([Validators.required]);
      this.userForm.controls['client_id'].updateValueAndValidity()
    }
  }

  selectLocation(event: any) {
    console.log('selectLocation event: ', event.target.value);
    this.client_list = this.client_list.filter((f: any) => f.location_id == event.target.value);
  }

  getUserRole(acc_id: number) {
    this.api.allPostMethod("userRole/getUsersRoles", { account_id: acc_id }).subscribe((roles: any) => {
      if (roles.data?.length > 0) {
        this.user_roles = roles.data;
      }
    });
    this.api.allPostMethod('locations/locationlist', { account_id: acc_id, pageNumber: 1, pageSize: 10 }).subscribe((res: any) => {
      if (res.data?.length > 0) {
        this.user_location = res.data;
      }
    });
    this.api.allPostMethod('clients/clientlist', { account_id: acc_id, pageNumber: 1, pageSize: 10 }).subscribe((res: any) => {
      if (res.data?.length > 0) {
        this.client_list = res.data;
      }
    })
  }

  onSubmit() {
    if (this.userForm.invalid) {
      this.isFormValid.set(true);
      return
    }
    let date = '';
    this.communicate.isLoaderLoad.next(true);
    date = this.convertDate(this.userForm.value.dob);
    this.userForm.patchValue({
      role_id: Number(this.userForm.value.role_id),
      account_id: Number(this.userForm.value.account_id),
      location_id: Number(this.userForm.value.location_id),
      client_id: Number(this.userForm.value.client_id),
      status: Number(this.isActive)
    });
    let payload = { ...this.userForm.value, dob: date, profile_img: this.imgURLBase64() }
    this.api.allPostMethod("users/addUser", payload).subscribe((response: any) => {
      this.communicate.isLoaderLoad.next(false);
      if (response['error'] != true) {
        this.userForm.reset();
        this.toastr.success("User added succesfully", "")
        this.communicate.isDetailSideShow.next(true);
        this.router.navigate(['/dashboard-detail/user-detail']);
      } else {
        this.toastr.error(response['message'], "");
      }
    })
  }

  forEditData(acc_id: any) {
    this.activeRouter.queryParams.subscribe((params: any) => {
      if (params.id != null || params.id != undefined) {
        let data = {
          id: Number(params.id),
          account_id: acc_id,
        }
        this.communicate.isLoaderLoad.next(true);
        this.api.allPostMethod("users/getUser", data).subscribe((editData: any) => {
          this.communicate.isLoaderLoad.next(false);
          if (editData['error'] != true) {
            let editableData = editData['data'];
            this.userForm.patchValue({
              f_name: editableData?.f_name,
              l_name: editableData?.l_name,
              alias: editableData?.alias,
              dob: editableData?.dob,
              email: editableData?.email,
              website: editableData?.website,
              phone: editableData?.phone,
              mobile: editableData?.mobile,
              fax: editableData?.fax,
              street: editableData?.street,
              state: editableData?.state,
              zip: editableData?.zip,
              city: editableData?.city,
              country: editableData?.country,
            });
            this.isActive = editableData?.status;
            this.imgURLBase64.set(editableData?.profile_img);
            this.userForm.controls['profile_img'].clearValidators();
            this.userForm.controls['profile_img'].updateValueAndValidity();
            this.userForm.addControl("id", new FormControl(editableData?.id));
            this.userForm.removeControl('role_id');
            this.userForm.removeControl('client_id');
            this.userForm.removeControl('location_id');
          } else {

          }
        })
        this.editUser = true;
      }
    });
  }

  onEditUser() {
    if (this.userForm.invalid) {
      this.isFormValid.set(true);
      return
    }
    this.communicate.isLoaderLoad.next(true);
    this.userForm.get('status')?.patchValue(Number(this.isActive));
    let isBase64 = this.communicate.isBase64(this.imgURLBase64());
    // this.userForm.value = {...this.userForm.value, id : }
    let payload = { ...this.userForm.value, profile_img: (isBase64 ? this.imgURLBase64() : false) };
    this.api.allPostMethod("users/updateUserProfile", payload).subscribe((res: any) => {

      this.communicate.isLoaderLoad.next(false);
      if (res['error'] != true) {
        this.toastr.success("User profile update successfully", "")
        this.router.navigate(['/dashboard-detail/user-detail']);
      } else {
        this.toastr.error(res['message'], "");
      }
    })
  }

  convertDate(dateString: string) {
    var parts = dateString.split("-");
    console.log('parts: ', parts);
    var newParts = [parts[2], parts[1], parts[0]];
    console.log('newParts: ', newParts);
    var newDateString = parts.join("-");
    return dateString;
  }

  convertImageToBase64(file_event: any) {
    const reader = new FileReader();
    reader.readAsDataURL(file_event);
    reader.onload = () => {
      this.imgURLBase64.set(reader.result)
    };
  }

  crossBtn() {
    this.imgURLBase64.set('');
    this.userForm.get('profile_img')?.setValue('');
    this.userForm.controls['profile_img'].addValidators(Validators.required);
    this.userForm.controls['profile_img'].updateValueAndValidity();
  }

  onFileChange(event: any) {
    this.selectedFileName = event.target.files[0]?.name
    if (event.dataTransfer) {
      let file = event.dataTransfer.files
      this.userForm.controls['profile_img'].clearValidators();
      this.userForm.controls['profile_img'].updateValueAndValidity();
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

}
