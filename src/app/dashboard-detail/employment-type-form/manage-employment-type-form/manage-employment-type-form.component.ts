import { Component, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { environment } from '../../../../environments/environment';
import { CommonApiService } from '../../../core/services/common-api.service';
import { ToastrService } from 'ngx-toastr';
import { CommunicateService } from '../../../core/services/communicate.service';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, combineLatestWith, map } from 'rxjs';

@Component({
  selector: 'app-manage-employment-type-form',
  templateUrl: './manage-employment-type-form.component.html',
  styleUrl: './manage-employment-type-form.component.css'
})
export class ManageEmploymentTypeFormComponent {

  addEmploymentTypeForm: FormGroup;
  sql_validation = signal(environment.SQL_validation);
  formValid = signal<boolean>(false);
  determineSubmission = signal<any>({});
  acc_id = signal<number>(0);

  constructor(private fb: FormBuilder, private api: CommonApiService, private toastr: ToastrService, private communicate: CommunicateService, private router: Router, private activeRoute: ActivatedRoute) {
    let user_data: any = localStorage.getItem('Shared_Data');
    user_data = JSON.parse(user_data);
    this.acc_id.set(user_data?.account_id);
    this.addEmploymentTypeForm = this.fb.group({
      account_id: new FormControl(user_data?.account_id),
      name: new FormControl('', [Validators.required, Validators.minLength(3), Validators.pattern(this.sql_validation())]),
      description: new FormControl('', [Validators.required, Validators.pattern(this.sql_validation())]),
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

  get formData() { return this.addEmploymentTypeForm.controls };

  onCheckChange(event: any) {
    this.addEmploymentTypeForm.value.is_active = event.target.checked == true ? 1 : 0;
  }

  determineSaveFunc() {
    if (this.determineSubmission()['path'] == 'add') {
      this.saveAddEmploymentTypeForm();
    } else {
      this.editAddEmploymentTypeForm();
    }
  }



  saveAddEmploymentTypeForm() {
    if (this.addEmploymentTypeForm.invalid) {
      this.formValid.set(true);
      return;
    }
    this.communicate.isLoaderLoad.next(true);
    this.api.allPostMethod("employement-type/add-employment-type", this.addEmploymentTypeForm.value).subscribe((res: any) => {
      this.communicate.isLoaderLoad.next(false);
      if (res['error'] != true) {
        if (res['data']) {
          this.toastr.success("Employment type created successfully", "");
          this.router.navigate(['dashboard-detail/employment-type']);
        } else {
          this.toastr.error("Something went wrong", "");
        }
      } else {
        this.toastr.error("Something went wrong", "");
      }
    });
  }

  editAddEmploymentTypeForm() {
    if (this.addEmploymentTypeForm.invalid) {
      this.formValid.set(true);
      return;
    }
    this.communicate.isLoaderLoad.next(true);
    this.api.allPostMethod("employement-type/update-employment-type", this.addEmploymentTypeForm.value).subscribe((res: any) => {
      this.communicate.isLoaderLoad.next(false);
      if (res['error'] != true) {
        if (res['data']) {
          this.toastr.success("Employment type updated successfully", "");
          this.router.navigate(['dashboard-detail/employment-type']);
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
    this.api.allPostMethod("employement-type/get-employment-type", { id: id, account_id: this.acc_id() }).subscribe((res: any) => {
      this.communicate.isLoaderLoad.next(false);
      if (res['error'] != true) {
        if (res['data']) {
          this.addEmploymentTypeForm.addControl('id', new FormControl(res['data']?.id));
          this.addEmploymentTypeForm.patchValue({
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

  selectIsFeatured(event: any){
    console.log('event',event.target.value)
  }



}
