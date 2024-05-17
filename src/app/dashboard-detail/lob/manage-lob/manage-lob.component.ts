import { Component, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { environment } from '../../../../environments/environment';
import { CommonApiService } from '../../../core/services/common-api.service';
import { ToastrService } from 'ngx-toastr';
import { CommunicateService } from '../../../core/services/communicate.service';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, combineLatestWith, map } from 'rxjs';

@Component({
  selector: 'app-manage-lob',
  templateUrl: './manage-lob.component.html',
  styleUrl: './manage-lob.component.css'
})
export class ManageLobComponent {
  addLobForm: FormGroup;
  sql_validation = signal(environment.SQL_validation);
  formValid = signal<boolean>(false);
  determineSubmission = signal<any>({});
  acc_id = signal<number>(0);

  constructor(private fb: FormBuilder, private api: CommonApiService, private toastr: ToastrService, private communicate: CommunicateService, private router: Router, private activeRoute: ActivatedRoute) {
    let user_data: any = localStorage.getItem('Shared_Data');
    user_data = JSON.parse(user_data);
    this.acc_id.set(user_data?.account_id);
    this.addLobForm = this.fb.group({
      account_id: new FormControl(user_data?.account_id),
      name: new FormControl('', [Validators.required, Validators.minLength(3), Validators.pattern(this.sql_validation())]),
      about: new FormControl('', [Validators.required, Validators.pattern(this.sql_validation())]),
      status: new FormControl(1),
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

  get formData() { return this.addLobForm.controls };

  onCheckChange(event: any) {
    this.addLobForm.value.status = event.target.checked ? 1 : 0;
  }

  determineSaveFunc() {
    if (this.determineSubmission()['path'] == 'add') {
      this.saveAddLobForm();
    } else {
      this.editAddLobForm();
    }
  }

  saveAddLobForm() {
    if (this.addLobForm.invalid) {
      this.formValid.set(true);
      return;
    }
    this.communicate.isLoaderLoad.next(true);
    this.api.allPostMethod("lob/addLob", this.addLobForm.value).subscribe((res: any) => {
      this.communicate.isLoaderLoad.next(false);
      if (res['error'] != true) {
        if (res['data']) {
          this.toastr.success("LOB created successfully", "");
          this.router.navigate(['dashboard-detail/lob-detail']);
        } else {
          this.toastr.error("Something went wrong", "");
        }
      } else {
        this.toastr.error("Something went wrong", "");
      }
    });
  }

  editAddLobForm() {
    if (this.addLobForm.invalid) {
      this.formValid.set(true);
      return;
    }
    this.communicate.isLoaderLoad.next(true);
    this.api.allPostMethod("lob/updateLob", this.addLobForm.value).subscribe((res: any) => {
      this.communicate.isLoaderLoad.next(false);
      if (res['error'] != true) {
        if (res['data']) {
          this.toastr.success("LOB updated successfully", "");
          this.router.navigate(['dashboard-detail/lob-detail']);
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
    this.api.allPostMethod("lob/getLob", { id: id, account_id: this.acc_id() }).subscribe((res: any) => {
      this.communicate.isLoaderLoad.next(false);
      if (res['error'] != true) {
        if (res['data']) {
          this.addLobForm.addControl('id', new FormControl(res['data']?.id));
          this.addLobForm.patchValue({
            name: res['data']?.name,
            about: res['data']?.about,
            account_id: res['data']?.account_id,
            status: res['data']?.status
          });
        } else {
          this.toastr.error("Something went wrong", "");
        }
      } else {
        this.toastr.error("Something went wrong", "");
      }
    });
  }
}
