import { Component, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { environment } from '../../../../environments/environment';
import { CommonApiService } from '../../../core/services/common-api.service';
import { ToastrService } from 'ngx-toastr';
import { CommunicateService } from '../../../core/services/communicate.service';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, combineLatestWith, map } from 'rxjs';


@Component({
  selector: 'app-manage-work-authorization',
  templateUrl: './manage-work-authorization.component.html',
  styleUrl: './manage-work-authorization.component.css'
})
export class ManageWorkAuthorizationComponent {

  addWorkAuthorizationForm: FormGroup;
  sql_validation = signal(environment.SQL_validation);
  formValid = signal<boolean>(false);
  determineSubmission = signal<any>({});
  acc_id = signal<number>(0);

  constructor(private fb: FormBuilder, private api: CommonApiService, private toastr: ToastrService, private communicate: CommunicateService, private router: Router, private activeRoute: ActivatedRoute) {
    let user_data: any = localStorage.getItem('Shared_Data');
    user_data = JSON.parse(user_data);
    this.acc_id.set(user_data?.account_id);
    this.addWorkAuthorizationForm = this.fb.group({
      account_id: new FormControl(user_data?.account_id),
      name: new FormControl('', [Validators.required, Validators.minLength(3)]),
      description: new FormControl('', [Validators.required]),
      is_active: new FormControl(1),
      is_featured: new FormControl('1', [Validators.required])
    });
  }

  ngOnInit() {
    this.activeRoute.url
      .pipe(
        combineLatestWith(this.activeRoute.queryParams),
        map(([url, queryParams]) => ({ path: url[0].path, id: queryParams['id'] }))
      )
      .subscribe(results => {
        this.determineSubmission.set(results);
        if (results.path == 'edit') {
          this.setDataToEdit(results.id);
        }
      });
  }

  get formData() { return this.addWorkAuthorizationForm.controls };

  onCheckChange(event: any) {
    this.addWorkAuthorizationForm.value.is_active = event.target.checked == true ? 1 : 0;
  }

  determineSaveFunc() {
    if (this.determineSubmission()['path'] == 'add') {
      this.saveAddWorkAuthorizationForm();
    } else {
      this.editAddWorkAuthorizationForm();
    }
  }



  saveAddWorkAuthorizationForm() {
    if (this.addWorkAuthorizationForm.invalid) {
      this.formValid.set(true);
      return;
    }
    this.communicate.isLoaderLoad.next(true);
    this.api.allPostMethod("work-authorization/add-work-authorization", this.addWorkAuthorizationForm.value).subscribe((res: any) => {
      this.communicate.isLoaderLoad.next(false);
      if (res['error'] != true) {
        if (res['data']) {
          this.toastr.success("Work authorization created successfully", "");
          this.router.navigate(['dashboard-detail/work-authorization']);
        } else {
          this.toastr.error("Something went wrong", "");
        }
      } else {
        this.toastr.error("Something went wrong", "");
      }
    });
  }

  editAddWorkAuthorizationForm() {
    if (this.addWorkAuthorizationForm.invalid) {
      this.formValid.set(true);
      return;
    }
    this.communicate.isLoaderLoad.next(true);
    this.api.allPostMethod("work-authorization/edit-work-authorization", this.addWorkAuthorizationForm.value).subscribe((res: any) => {
      this.communicate.isLoaderLoad.next(false);
      if (res['error'] != true) {
        if (res['data']) {
          this.toastr.success("Work authorization updated successfully", "");
          this.router.navigate(['dashboard-detail/work-authorization']);
        } else {
          this.toastr.error("Something went wrong", "");
        }
      } else {
        this.toastr.error("Something went wrong", "");
      }
    });
  }

  setDataToEdit(id: number) {
    this.communicate.isLoaderLoad.next(true);
    this.api.allPostMethod("work-authorization/get-work-authorization", { id: id, account_id: this.acc_id() }).subscribe((res: any) => {
      this.communicate.isLoaderLoad.next(false);
      if (res['error'] != true) {
        if (res['data']) {
          this.addWorkAuthorizationForm.addControl('id', new FormControl(res['data']?.id));
          this.addWorkAuthorizationForm.patchValue({
            name: res['data']?.name,
            description: res['data']?.description,
            account_id: res['data']?.account_id,
            is_featured: res['data']?.is_featured == true ? 1 : 0,
            is_active: res['data']?.is_active == true ? 1 : 0
          });
        } else {
          this.toastr.error("Something went wrong", "");
        }
      } else {
        this.toastr.error("Something went wrong", "");
      }
    });
  }

  selectIsFeatured(event: any) {
    console.log('event', event.target.value)
  }



}
