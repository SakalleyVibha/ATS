import { Component, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { environment } from '../../../../environments/environment';
import { CommonApiService } from '../../../core/services/common-api.service';
import { ToastrService } from 'ngx-toastr';
import { CommunicateService } from '../../../core/services/communicate.service';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, combineLatestWith, map } from 'rxjs';

@Component({
  selector: 'app-manage-work-configuration',
  templateUrl: './manage-work-configuration.component.html',
  styleUrl: './manage-work-configuration.component.css'
})
export class ManageWorkConfigurationComponent {

  addWorkConfigForm: FormGroup;
  sql_validation = signal(environment.SQL_validation);
  formValid = signal<boolean>(false);
  determineSubmission = signal<any>({});
  acc_id = signal<number>(0);

  constructor(private fb: FormBuilder, private api: CommonApiService, private toastr: ToastrService, private communicate: CommunicateService, private router: Router, private activeRoute: ActivatedRoute) {
    let user_data: any = localStorage.getItem('Shared_Data');
    user_data = JSON.parse(user_data);
    this.acc_id.set(user_data?.account_id);
    this.addWorkConfigForm = this.fb.group({
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

  get formData() { return this.addWorkConfigForm.controls };

  onCheckChange(event: any) {
    this.addWorkConfigForm.value.is_active = event.target.checked == true ? 1 : 0;
  }

  determineSaveFunc() {
    if (this.determineSubmission()['path'] == 'add') {
      this.saveAddWorkConfigurationForm();
    } else {
      this.editAddWorkConfigurationForm();
    }
  }



  saveAddWorkConfigurationForm() {
    if (this.addWorkConfigForm.invalid) {
      this.formValid.set(true);
      return;
    }
    this.communicate.isLoaderLoad.next(true);
    this.api.allPostMethod("work-configurations/add-work-configuration-list", this.addWorkConfigForm.value).subscribe((res: any) => {
      this.communicate.isLoaderLoad.next(false);
      if (res['error'] != true) {
        if (res['data']) {
          this.toastr.success("Work configuration created successfully", "");
          this.router.navigate(['dashboard-detail/work-configuration']);
        } else {
          this.toastr.error("Something went wrong", "");
        }
      } else {
        this.toastr.error("Something went wrong", "");
      }
    });
  }

  editAddWorkConfigurationForm() {
    if (this.addWorkConfigForm.invalid) {
      this.formValid.set(true);
      return;
    }
    this.communicate.isLoaderLoad.next(true);
    this.api.allPostMethod("work-configurations/edit", this.addWorkConfigForm.value).subscribe((res: any) => {
      this.communicate.isLoaderLoad.next(false);
      if (res['error'] != true) {
        if (res['data']) {
          this.toastr.success("Work configuration updated successfully", "");
          this.router.navigate(['dashboard-detail/work-configuration']);
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
    this.api.allPostMethod("work-configurations/getById", { id: id, account_id: this.acc_id() }).subscribe((res: any) => {
      this.communicate.isLoaderLoad.next(false);
      if (res['error'] != true) {
        if (res['data']) {
          this.addWorkConfigForm.addControl('id', new FormControl(res['data']?.id));
          this.addWorkConfigForm.patchValue({
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
