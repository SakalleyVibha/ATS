import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonApiService } from '../../../core/services/common-api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-manage-user',
  templateUrl: './manage-user.component.html',
  styleUrl: './manage-user.component.css'
})
export class ManageUserComponent {

  userForm: FormGroup;
  isFormValid: boolean = false;
  user_roles: any;
  user_location: any;
  client_list: any;
  maxDOB: any;
  editUser: boolean = false;
  selected_details: any;

  constructor(private formBuild: FormBuilder, private api: CommonApiService, private router: Router, private toastr: ToastrService, private activeRouter: ActivatedRoute) {
    let user_data: any = localStorage.getItem('Shared_Data');
    user_data = JSON.parse(user_data);

    this.selected_details = {
      role: 1,
      location: 0
    }

    this.userForm = this.formBuild.group({
      f_name: ['', [Validators.required, Validators.minLength(2), Validators.pattern(/^(?!(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|EXEC|ALTER|CREATE|TRUNCATE)|(['";\\])|(\b\d+\b)|(\/\*[\s\S]*?\*\/|--.*)|(AND|OR|NOT|XOR)|\b(?:SELECT|INSERT|UPDATE|DELETE|EXEC)\s*\(|(error|exception|warning))/i)]],
      l_name: ['', [Validators.required, Validators.minLength(2), Validators.pattern(/^(?!(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|EXEC|ALTER|CREATE|TRUNCATE)|(['";\\])|(\b\d+\b)|(\/\*[\s\S]*?\*\/|--.*)|(AND|OR|NOT|XOR)|\b(?:SELECT|INSERT|UPDATE|DELETE|EXEC)\s*\(|(error|exception|warning))/i)]],
      alias: ['', [Validators.required, Validators.pattern(/^(?!(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|EXEC|ALTER|CREATE|TRUNCATE)|(['";\\])|(\b\d+\b)|(\/\*[\s\S]*?\*\/|--.*)|(AND|OR|NOT|XOR)|\b(?:SELECT|INSERT|UPDATE|DELETE|EXEC)\s*\(|(error|exception|warning))/i)]],
      dob: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      website: ['', [Validators.required, Validators.pattern('(^((http|https)://)|((www)[.]))[A-Za-z0-9_@./#!$%^:*&+-]+([\-\.]{1}[a-z0-9]+)*\.(?:com|net|in|org|io)$')]],
      phone: ['', [Validators.required, Validators.pattern('[6-9][0-9]{12}')]],
      mobile: ['', [Validators.required, Validators.pattern('[6-9][0-9]{12}')]],
      fax: ['', [Validators.required, Validators.minLength(10), Validators.pattern('^[0-9]*$'), Validators.maxLength(13)]],

      street: ['', [Validators.required, Validators.pattern(/^(?!(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|EXEC|ALTER|CREATE|TRUNCATE)|(['";\\])|(\b\d+\b)|(\/\*[\s\S]*?\*\/|--.*)|(AND|OR|NOT|XOR)|\b(?:SELECT|INSERT|UPDATE|DELETE|EXEC)\s*\(|(error|exception|warning))/i)]],
      city: ['', [Validators.required, Validators.pattern(/^(?!(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|EXEC|ALTER|CREATE|TRUNCATE)|(['";\\])|(\b\d+\b)|(\/\*[\s\S]*?\*\/|--.*)|(AND|OR|NOT|XOR)|\b(?:SELECT|INSERT|UPDATE|DELETE|EXEC)\s*\(|(error|exception|warning))/i)]],
      country: ['', [Validators.required, Validators.pattern(/^(?!(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|EXEC|ALTER|CREATE|TRUNCATE)|(['";\\])|(\b\d+\b)|(\/\*[\s\S]*?\*\/|--.*)|(AND|OR|NOT|XOR)|\b(?:SELECT|INSERT|UPDATE|DELETE|EXEC)\s*\(|(error|exception|warning))/i)]],
      state: ['', [Validators.required, Validators.pattern(/^(?!(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|EXEC|ALTER|CREATE|TRUNCATE)|(['";\\])|(\b\d+\b)|(\/\*[\s\S]*?\*\/|--.*)|(AND|OR|NOT|XOR)|\b(?:SELECT|INSERT|UPDATE|DELETE|EXEC)\s*\(|(error|exception|warning))/i)]],
      zip: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6), Validators.pattern('^[0-9]*$')]],
      role_id: ['', [Validators.required]],
      account_id: [user_data.account_id],
      location_id: [''],
      client_id: ['']
    });
    this.getUserRole(user_data.account_id);
  }

  get formData() { return this.userForm.controls }

  ngOnInit() {
    // this.getUserRole();
    let date = new Date();
    this.maxDOB = `${date.getFullYear()}-${date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1}-${date.getDate() < 10 ? `0${date.getDate() - 1}` : date.getDate() - 1}`;
    this.activeRouter.queryParams.subscribe((params: any) => {
      if (params.id != null || params.id != undefined) {
        this.editUser = true;
      }
    });
  }

  selectRole(event: any) {
    console.log('event: ', event.target.value);
    this.selected_details.role = event.target.value;
    if (event.target.value == 2 && (this.user_location && this.user_location.length > 0)) {
      this.userForm.controls['location_id'].setValidators([Validators.required])
      this.userForm.controls['location_id'].updateValueAndValidity()
    } else if (event.target.value == 3 && (this.client_list && this.client_list.length > 0)) {
      this.userForm.controls['client_id'].setValidators([Validators.required])
      this.userForm.controls['client_id'].updateValueAndValidity()
    }
  }

  selectLocation(event: any) {
    this.client_list = this.client_list?.filter((f: any) => f.location_id == event.target.value);
  }

  getUserRole(acc_id: number) {
    this.api.allgetMethod("role/roles").subscribe((roles: any) => {
      if (roles.data.length > 0) {
        this.user_roles = roles.data;
      }
    });
    this.api.allPostMethod('locations/locationlist', { account_id: acc_id, pageNumber: 1, pageSize: 10 }).subscribe((res: any) => {
      if (res.data.length > 0) {
        this.user_location = res.data;
      }
    });
    this.api.allPostMethod('clients/clientlist', { account_id: acc_id, pageNumber: 1, pageSize: 10 }).subscribe((res: any) => {
      if (res.data.length > 0) {
        this.client_list = res.data;
      }
    })
  }

  onSubmit() {
    if (this.userForm.invalid) {
      this.isFormValid = true;
      return
    }
    let date = '';
    date = this.convertDate(this.userForm.value.dob);
    console.log(date);
    this.userForm.patchValue({
      dob: date,
      role_id: Number(this.userForm.value.role_id),
      account_id: Number(this.userForm.value.account_id),
      location_id: Number(this.userForm.value.location_id),
      client_id: Number(this.userForm.value.client_id)
    });
    console.log(this.userForm.value);
    this.api.allPostMethod("users/addUser", this.userForm.value).subscribe((response: any) => {
      if (response.error == false) {
        this.toastr.success("User added succesfully", "", { closeButton: true, timeOut: 5000 }).onHidden.subscribe(() => {
          this.router.navigate(['/create-user-location/user-detail']);
        });
      } else {
        this.toastr.error("Something went wrong, Please try again later", "", { closeButton: true, timeOut: 5000 });
      }
    })
  }

  onEditUser() {

  }

  convertDate(dateString: string) {
    var parts = dateString.split("-");
    var newParts = [parts[2], parts[1], parts[0]];
    var newDateString = newParts.join("-");
    return newDateString;
  }
}
