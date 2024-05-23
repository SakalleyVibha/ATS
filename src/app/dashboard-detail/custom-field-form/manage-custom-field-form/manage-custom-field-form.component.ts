import { Component, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { environment } from '../../../../environments/environment';
import { CommonApiService } from '../../../core/services/common-api.service';
import { ToastrService } from 'ngx-toastr';
import { CommunicateService } from '../../../core/services/communicate.service';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, combineLatestWith, map } from 'rxjs';


@Component({
  selector: 'app-manage-custom-field-form',
  templateUrl: './manage-custom-field-form.component.html',
  styleUrl: './manage-custom-field-form.component.css'
})
export class ManageCustomFieldFormComponent {

  addCustomFieldForm: FormGroup;
  sql_validation = signal(environment.SQL_validation);
  formValid = signal<boolean>(false);
  determineSubmission = signal<any>({});
  acc_id = signal<number>(0);

  constructor(private fb: FormBuilder, private api: CommonApiService, private toastr: ToastrService, private communicate: CommunicateService, private router: Router, private activeRoute: ActivatedRoute) {
    let user_data: any = localStorage.getItem('Shared_Data');
    user_data = JSON.parse(user_data);
    this.acc_id.set(user_data?.account_id);
    this.addCustomFieldForm = this.fb.group({
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

  get formData() { return this.addCustomFieldForm.controls };

  onCheckChange(event: any) {
    this.addCustomFieldForm.value.is_active = event.target.checked == true ? 1 : 0;
  }

  determineSaveFunc() {
    if (this.determineSubmission()['path'] == 'add') {
      this.saveAddCustomFieldForm();
    } else {
      this.editAddCustomFieldForm();
    }
  }



  saveAddCustomFieldForm() {
    if (this.addCustomFieldForm.invalid) {
      this.formValid.set(true);
      return;
    }
    this.communicate.isLoaderLoad.next(true);
    this.api.allPostMethod("custome-field/add-custome-field", this.addCustomFieldForm.value).subscribe((res: any) => {
      this.communicate.isLoaderLoad.next(false);
      if (res['error'] != true) {
        if (res['data']) {
          this.toastr.success("Custom field created successfully", "");
          this.router.navigate(['dashboard-detail/custom-field']);
        } else {
          this.toastr.error("Something went wrong", "");
        }
      } else {
        this.toastr.error("Something went wrong", "");
      }
    });
  }

  editAddCustomFieldForm() {
    if (this.addCustomFieldForm.invalid) {
      this.formValid.set(true);
      return;
    }
    this.communicate.isLoaderLoad.next(true);
    this.api.allPostMethod("custome-field/edit", this.addCustomFieldForm.value).subscribe((res: any) => {
      this.communicate.isLoaderLoad.next(false);
      if (res['error'] != true) {
        if (res['data']) {
          this.toastr.success("Custom field updated successfully", "");
          this.router.navigate(['dashboard-detail/custom-field']);
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
    this.api.allPostMethod("custome-field/getById", { id: id, account_id: this.acc_id() }).subscribe((res: any) => {
      this.communicate.isLoaderLoad.next(false);
      if (res['error'] != true) {
        if (res['data']) {
          this.addCustomFieldForm.addControl('id', new FormControl(res['data']?.id));
          this.addCustomFieldForm.patchValue({
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
