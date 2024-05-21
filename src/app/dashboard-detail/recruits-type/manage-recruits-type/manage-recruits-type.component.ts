import { Component, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { environment } from '../../../../environments/environment';
import { CommonApiService } from '../../../core/services/common-api.service';
import { ToastrService } from 'ngx-toastr';
import { CommunicateService } from '../../../core/services/communicate.service';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, combineLatestWith, map } from 'rxjs';

@Component({
  selector: 'app-manage-recruits-type',
  templateUrl: './manage-recruits-type.component.html',
  styleUrl: './manage-recruits-type.component.css'
})
export class ManageRecruitsTypeComponent {

  addRecruitsTypeForm: FormGroup;
  sql_validation = signal(environment.SQL_validation);
  formValid = signal<boolean>(false);
  determineSubmission = signal<any>({});
  acc_id = signal<number>(0);

  constructor(private fb: FormBuilder, private api: CommonApiService, private toastr: ToastrService, private communicate: CommunicateService, private router: Router, private activeRoute: ActivatedRoute) {
    let user_data: any = localStorage.getItem('Shared_Data');
    user_data = JSON.parse(user_data);
    this.acc_id.set(user_data?.account_id);
    this.addRecruitsTypeForm = this.fb.group({
      account_id: new FormControl(user_data?.account_id),
      name: new FormControl('', [Validators.required, Validators.minLength(3), Validators.pattern(this.sql_validation())]),
      description: new FormControl('', [Validators.required, Validators.pattern(this.sql_validation())]),
      status: new FormControl(1),
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

  get formData() { return this.addRecruitsTypeForm.controls };

  onCheckChange(event: any) {
    this.addRecruitsTypeForm.value.status = event.target.checked == true ? 1 : 0;
  }

  determineSaveFunc() {
    if (this.determineSubmission()['path'] == 'add') {
      this.saveAddRecruitsTypeForm();
    } else {
      this.editAddRecruitsTypeForm();
    }
  }



  saveAddRecruitsTypeForm() {
    if (this.addRecruitsTypeForm.invalid) {
      this.formValid.set(true);
      return;
    }
    this.communicate.isLoaderLoad.next(true);
    this.api.allPostMethod("recruits-type/add-recruits-type", this.addRecruitsTypeForm.value).subscribe((res: any) => {
      this.communicate.isLoaderLoad.next(false);
      if (res['error'] != true) {
        if (res['data']) {
          this.toastr.success("Recruits type created successfully", "");
          this.router.navigate(['dashboard-detail/recruits-type']);
        } else {
          this.toastr.error("Something went wrong", "");
        }
      } else {
        this.toastr.error("Something went wrong", "");
      }
    });
  }

  editAddRecruitsTypeForm() {
    if (this.addRecruitsTypeForm.invalid) {
      this.formValid.set(true);
      return;
    }
    this.communicate.isLoaderLoad.next(true);
    this.api.allPostMethod("recruits-type/update-recruits-type", this.addRecruitsTypeForm.value).subscribe((res: any) => {
      this.communicate.isLoaderLoad.next(false);
      if (res['error'] != true) {
        if (res['data']) {
          this.toastr.success("Recruits type updated successfully", "");
          this.router.navigate(['dashboard-detail/recruits-type']);
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
    this.api.allPostMethod("recruits-type/get-recruits-type", { id: id, account_id: this.acc_id() }).subscribe((res: any) => {
      this.communicate.isLoaderLoad.next(false);
      if (res['error'] != true) {
        if (res['data']) {
          this.addRecruitsTypeForm.addControl('id', new FormControl(res['data']?.id));
          this.addRecruitsTypeForm.patchValue({
            name: res['data']?.name,
            description: res['data']?.description,
            account_id: res['data']?.account_id,
            is_featured: res['data']?.is_featured == true ? 1 : 0,
            status: res['data']?.status == true ? 1 : 0
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
