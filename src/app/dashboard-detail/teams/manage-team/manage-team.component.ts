import { Component, signal } from '@angular/core';
import { CommonApiService } from '../../../core/services/common-api.service';
import { CommunicateService } from '../../../core/services/communicate.service';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { delay, of, single } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { IDropdownSettings } from 'ng-multiselect-dropdown';

@Component({
  selector: 'app-manage-team',
  templateUrl: './manage-team.component.html',
  styleUrl: './manage-team.component.css'
})
export class ManageTeamComponent {

  imgURLBase64 = signal<ArrayBuffer | any>('');
  teamForm: FormGroup;
  assignUserForm!: FormGroup;
  isFieldsValid = signal(false);
  Teamedit = signal(false);
  sql_validation = signal(environment.SQL_validation);
  isActive = signal(true);
  user_list = signal<any>([]);//changermade
  role_list = signal<any>([]);
  team_id = signal<number>(-1);
  dropdownSettings = {};
  filteredUser = signal<any>(undefined);
  editedRoleList = signal<any>(undefined);
  showValidation = signal<boolean>(false);

  constructor(private api: CommonApiService, private communicate: CommunicateService, private formbuild: FormBuilder, private toastr: ToastrService, private router: Router, private activeRout: ActivatedRoute) {
    let user_data: any = localStorage.getItem('Shared_Data');
    user_data = JSON.parse(user_data);
    this.teamForm = this.formbuild.group({
      account_id: new FormControl(user_data?.account_id),
      name: new FormControl('', [Validators.required]),
      about: new FormControl('', [Validators.required, Validators.maxLength(150), Validators.pattern(this.sql_validation())]),
      logo: new FormControl('', [Validators.required]),
      status: new FormControl('')
    });



    this.getAllRoles()
    this.createAssignUser(user_data?.account_id);
    this.getUserList(user_data?.account_id);
  }

  ngOnInit() {
    ////changermade
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };
    //changermade
    this.activeRout.queryParams.subscribe((res: any) => {
      if (res.id != null || res.id != undefined) {
        this.communicate.isLoaderLoad.next(true);
        this.api.allPostMethod("team/getTeam", res).subscribe((updateData: any) => {
          this.Teamedit.set(true);
          updateData = updateData.data;
          this.teamForm.patchValue({
            name: updateData?.name,
            about: updateData?.about,
            account_id: updateData?.account_id
          });

          updateData.user_team_relations.map((data: any) => {
            this.userList.push(this.formbuild.group({
              role: data['account_user']?.role_id,
              user_id: data['account_user']?.id,
              status: data?.status
            }));
            // itemToSetArr.push({ user_id: data['account_user'].id, role: data['account_user'].role_id, status: data?.status })
          })
          // this.assignUserForm?.get(['userList', 0])?.setValue(itemToSetArr);
          this.isActive.set(updateData?.status);
          this.imgURLBase64.set(updateData?.logo);
          this.teamForm.addControl('id', new FormControl(updateData?.id));
          this.teamForm.controls['logo'].removeValidators(Validators.required);
          this.teamForm.controls['logo'].updateValueAndValidity();
          this.communicate.isLoaderLoad.next(false);
        });
      }
    });
  }
  //changermade

  //changermade
  get formData() { return this.teamForm.controls };

  onFormSubmit() {
    return new Promise((resolve, reject) => {
      if (this.teamForm.invalid) {
        this.isFieldsValid.set(true);
        return;
      }

      let token = { ...this.teamForm.value, logo: this.imgURLBase64(), status: Number(this.isActive()) };
      this.api.allPostMethod("team/addTeam", token).subscribe((res: any) => {
        if (res['error'] != true) {
          if (res['data']) {
            this.team_id.set(res['data'].id);
            this.toastr.success("Team created successfully", "")
          } else {
            this.toastr.error("Something went wrong", "");
          }
          resolve(true);
        } else {
          this.toastr.error("Something went wrong", "");
          resolve(false);
        }
      });
    })
  }

  onEditTeam() {
    return new Promise((resolve, reject) => {

      if (this.teamForm.invalid) {
        this.isFieldsValid.set(true);
        return;
      }
      let payload;
      let isBase64 = this.communicate.isBase64(this.imgURLBase64());

      payload = { ...this.teamForm.value, logo: (isBase64 ? this.imgURLBase64() : false), status: Number(this.isActive()) };
      this.api.allPostMethod("team/updateTeam", payload).subscribe((res: any) => {
        if (res['error'] != true) {
          if (res.data.length > 0) {
            this.team_id.set(this.teamForm.value.id);
            this.toastr.success("Team updated successfully", "")
          } else {
            this.toastr.error("Something went wrong", "");
          }
          resolve(true);
        } else {
          this.toastr.error("Something went wrong", "");
          resolve(false);
        }
      });
    })
  }

  convertImageToBase64(file_event: any) {
    new Promise((resolve, reject) => {//changermade

      const reader = new FileReader();
      reader.readAsDataURL(file_event);
      reader.onload = async () => {
        this.imgURLBase64.set(reader.result);
        //changermade
        if (this.imgURLBase64()) {
          resolve(true);
        } else {
          resolve(false);
        }
        //changermade
      };
    })
  }

  CrossBtn() {
    this.imgURLBase64.set('');
    this.teamForm.get('logo')?.setValue('');
    this.teamForm.controls['logo'].addValidators(Validators.required);
    this.teamForm.controls['logo'].updateValueAndValidity();
  }

  async onFileChange(event: any) {//changermade
    if (event.dataTransfer) {
      let file = event.dataTransfer.files
      this.teamForm.controls['logo'].removeValidators(Validators.required);
      this.teamForm.controls['logo'].updateValueAndValidity();
      let bs64Value = await this.convertImageToBase64(file[0]);//changermade
      return
    }
    if (event.srcElement && event.srcElement != undefined) {
      let file = event.srcElement.files
      let bs64Value = await this.convertImageToBase64(file[0]);//changermade
    }
  }

  getUserList(acc_id: number) {
    this.api.allPostMethod("users/getUserList", { account_id: acc_id, pageNumber: 1, pageSize: 10 }).subscribe((response: any) => {
      if (response['error'] == false) {
        this.user_list.set(response['data']);

      }
    })
  }

  get userList() {
    return this.assignUserForm.controls['userList'] as FormArray;
  }

  createAssignUser(acc_id: number) {
    this.assignUserForm = this.formbuild.group({
      account_id: new FormControl(acc_id),
      team_id: new FormControl(''),
      userList: this.formbuild.array([])
    });
  }

  async assignUserTeam() {
    let reqData: any = [];

    this.userList.value.map((data: any) => {
      if (Array.isArray(data['user_id']) && data['user_id'].length > 0) {
        data['user_id'].map((item: any) => {
          reqData.push({ status: data.status, user_id: item.id })
        });
      } else {
        this.showValidation.set(true);
      }
    });

    if (this.showValidation() == true) {
      return;
    }

    this.communicate.isLoaderLoad.next(true);
    if (this.Teamedit()) {
      let editTeam = await this.onEditTeam();
    } else {
      let editTeam = await this.onFormSubmit();
    }

    // this.assignUserForm.patchValue({
    //   team_id: this.team_id(),
    // });

    let req = {
      team_id: this.team_id(),
      account_id: this.assignUserForm.value.account_id,
      userList: reqData
    }
    this.api.allPostMethod('team/assingUser', req).subscribe((response: any) => {
      this.communicate.isLoaderLoad.next(false);
      if (response['error'] == true) {
        this.toastr.error("Something went wrong", "");
      } else {
        this.toastr.success(response['message'], "");
        this.router.navigate(['dashboard-detail/team']);
      }
    });
  }

  onCheckStatus(eve: any, id: number) {
    if (eve.target.checked == false) {
      this.assignUserForm.value.userList[id].status = 0;
    } else {
      this.assignUserForm.value.userList[id].status = 1;
    }
  }

  // deleteFromForm(id: number) {
  //   
  // }

  deleteFromForm(i: number) {
    this.userList.removeAt(i);
  }

  getAllRoles() {
    let get_roles = localStorage.getItem('role_list');
    if (get_roles) {
      this.role_list.set(JSON.parse(get_roles));
    }
  }

  selectedRole(event: any) {
    this.filteredUser.set(this.user_list().filter((user: any) => user.role_master?.id == event.target.value));

    let index = this.assignUserForm.value.userList.findIndex((user: any) => user.role == event.target.value);
    if (index != -1) {
      let idx = this.role_list().filter((user: any) => user.id != event.target.value)
      this.editedRoleList.set(idx);
    }
  }

  addUser() {
    this.userList.push(this.formbuild.group({
      role: new FormControl(''), user_id: new FormControl(0, [Validators.required]), status: new FormControl(1)
    }));
  }

  getRoleValue(i: number) {
    let obj = this.role_list().find((data: any) => data.id == this.assignUserForm.value.userList[i].role);
    return obj?.role_name ?? 'false';
  }

  getDataValues() {
    let finalArray = (!this.filteredUser() ? this.user_list() : this.filteredUser()).map((data: any) => {
      return { id: data.id, name: data.f_name + " " + data.l_name }
    });
    return finalArray;
  }
}
