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
  user_list : any = signal<any>([]);//changermade
  role_list = signal<any>([]);
  team_id = signal<number>(-1);
  dropdownSettings = {};
  filteredUser = signal<any>([]);
  editedRoleList = signal<any>([]);
  list: { name: string; checked: boolean; }[] | undefined;
  dropdownList!: { item_id: number; item_text: string; }[];//changermade
  selectedItems!: { item_id: number; item_text: string; }[];//changermade

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

    this.teamForm.statusChanges.subscribe((status) => {
      if (status === 'VALID') {
        of(null).pipe(
          delay(1000) // Delay execution by 1 second (1000 milliseconds)
        ).subscribe(() => {
          this.onFormSubmit();
        });//changermade
        // this.onFormSubmit();
        this.list = this.user_list();
        // this.submitButton.disabled = false;
      }
    });

    this.getAllRoles()
    this.createAssignUser(user_data?.account_id);
    this.getUserList(user_data?.account_id);
  }

  ngOnInit() {
    ////changermade
    this.dropdownList = [
      { item_id: 1, item_text: 'Mumbai' },
      { item_id: 2, item_text: 'Bangaluru' },
      { item_id: 3, item_text: 'Pune' },
      { item_id: 4, item_text: 'Navsari' },
      { item_id: 5, item_text: 'New Delhi' }
    ];
    this.selectedItems = [
      { item_id: 3, item_text: 'Pune' },
      { item_id: 4, item_text: 'Navsari' }
    ];
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
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

          let itemToSetArr: any = [];

          updateData.user_team_relations.map((data: any) => {
            this.userList.push(this.formbuild.group({
              user_id: data['account_user']?.id,
              role: data['account_user']?.role_id,
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

    this.dropdownSettings = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };
  }
  //changermade
  onItemSelect(item: any) {
    console.log(item);
  }
  onSelectAll(items: any) {
    console.log(items);
  }
//changermade
  get formData() { return this.teamForm.controls };

  onFormSubmit() {
    if (this.teamForm.invalid) {
      this.isFieldsValid.set(true);
      return;
    }
    // this.communicate.isLoaderLoad.next(true);
    let token = { ...this.teamForm.value, logo: this.imgURLBase64(), status: Number(this.isActive()) };
    console.log('token: ', this.imgURLBase64());
    // this.api.allPostMethod("team/addTeam", token).subscribe((res: any) => {
    //   this.communicate.isLoaderLoad.next(false);
    //   if (res['data']) {
    //     this.addUser();
    //     this.team_id.set(res['data'].id);
    //     this.toastr.success("Team created successfully", "")
    //   } else {
    //     this.toastr.error("Something went wrong", "")
    //   }
    // });
  }

  onEditTeam() {
    console.log('this.teamForm.value: ', this.teamForm.value);
    if (this.teamForm.invalid) {
      this.isFieldsValid.set(true);
      return;
    }
    this.communicate.isLoaderLoad.next(true);
    let payload;
    let isBase64 = this.communicate.isBase64(this.imgURLBase64());

    payload = { ...this.teamForm.value, logo: (isBase64 ? this.imgURLBase64() : false), status: Number(this.isActive()) };
    console.log(payload);
    this.api.allPostMethod("team/updateTeam", payload).subscribe((res: any) => {
      console.log(res);
      this.communicate.isLoaderLoad.next(false);
      if (res.data.length > 0) {
        this.team_id.set(this.teamForm.value.id);
        this.toastr.success("Team updated successfully", "")
      } else {
        this.toastr.error("Something went wrong", "");
      }
    });
  }

  convertImageToBase64(file_event: any) {
    new Promise((resolve, reject) => {//changermade

      const reader = new FileReader();
      reader.readAsDataURL(file_event);
      reader.onload = async () => {
        this.imgURLBase64.set(reader.result);
        //changermade
        if(this.imgURLBase64()){
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

  // onCheckChange(event: any) {

  //   console.log("event.target.value : ", event.target.value);


  //   // const formArray: FormArray = this.assignUserForm.get('userList') as FormArray;

  //   // this.assignUserForm.patchValue({
  //   //   team_id: this.team_id()
  //   // });
  //   // if (event.target.checked) {
  //   //   console.log('this.user_list(): ', this.user_list());
  //   //   let indexObj = this.user_list().find((user: any) => user.id == event.target.value);
  //   //   formArray.push(this.formbuild.group({
  //   //     user_id: new FormControl(indexObj.id), name: new FormControl(indexObj?.f_name + " "
  //   //       + indexObj?.l_name), role: new FormControl(indexObj.role_master['role_name']), status: new FormControl(1)
  //   //   }));
  //   // } else {
  //   //   let index = this.assignUserForm.value.userList.findIndex((user: any) => user.user_id == event.target.value);
  //   //   this.assignUserForm.value.userList.splice(index, 1);
  //   // }

  //   console.log("this.assignUserForm : ", this.assignUserForm.value);


  // }

  assignUserTeam() {
    this.assignUserForm.patchValue({
      team_id: this.team_id()
    });
    console.log('this.assignUserForm.value: ', this.assignUserForm.value);
    // this.communicate.isLoaderLoad.next(true);
    // this.api.allPostMethod('team/assingUser', this.assignUserForm.value).subscribe((response: any) => {
    //   this.toastr.success(response['message'], "");
    //   this.router.navigate(['dashboard-detail/team']);
    //   this.communicate.isLoaderLoad.next(false);
    // });
  }

  onCheckStatus(eve: any, id: number) {
    if (eve.target.checked == false) {
      this.assignUserForm.value.userList[id].status = 0;
    } else {
      this.assignUserForm.value.userList[id].status = 1;
    }
    console.log('this.assignUserForm.value.userList: ', this.assignUserForm.value.userList);
  }

  // deleteFromForm(id: number) {
  //   let index = this.assignUserForm.value.userList.findIndex((user: any) => user.user_id == id);
  //   this.assignUserForm.value.userList.splice(index, 1);
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
    console.log('this.filteredUser: ', this.filteredUser());

    let index = this.assignUserForm.value.userList.findIndex((user: any) => user.role == event.target.value)
    if (index != -1) {
      let idx = this.role_list().filter((user: any) => user.id != event.target.value)
      this.editedRoleList.set(idx);
    }
    console.log('this.editedRoleList: ', this.editedRoleList());
  }

  addUser() {
    this.userList.push(this.formbuild.group({
      user_id: new FormControl(), role: new FormControl(), status: new FormControl(0)
    }));
  }

  // shareCheckedList(item: any[]) {
  //   console.log(item);
  // }
  // shareIndividualCheckedList(item: {}) {
  //   console.log(item);
  // }
}
