import { Component, ViewChild, signal } from '@angular/core';
import { CommonApiService } from '../../../core/services/common-api.service';
import { CommunicateService } from '../../../core/services/communicate.service';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject, debounceTime, delay, distinctUntilChanged, filter, of, single } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-manage-team',
  templateUrl: './manage-team.component.html',
  styleUrl: './manage-team.component.css'
})
export class ManageTeamComponent {
  @ViewChild('imageModal') content: any;  
  
  imgURLBase64 = signal<ArrayBuffer | any>('');
  teamForm: FormGroup;
  assignUserForm!: FormGroup;
  isFieldsValid = signal(false);
  Teamedit = signal(false);
  sql_validation = signal(environment.SQL_validation);
  isActive = signal(true);
  user_list = signal<any>([]);
  role_list = signal<any>([]);
  team_id = signal<number>(-1);
  showValidation = signal<boolean>(false);
  searchValue = new Subject<Event>();
  searchString: string = ''
  userReqObj = signal<any>({});
  totalPages = signal<number>(0);
  modalRef: any;
  selectedFile: string = '';
  constructor(private api: CommonApiService, private communicate: CommunicateService, private formbuild: FormBuilder, private toastr: ToastrService, private router: Router, private activeRout: ActivatedRoute, private modalService: NgbModal) {
    let user_data: any = localStorage.getItem('Shared_Data');
    user_data = JSON.parse(user_data);
    this.teamForm = this.formbuild.group({
      account_id: new FormControl(user_data?.account_id),
      name: new FormControl('', [Validators.required]),
      about: new FormControl('', [Validators.required, Validators.maxLength(150), Validators.pattern(this.sql_validation())]),
      logo: new FormControl('', [Validators.required]),
      status: new FormControl('')
    });

    this.userReqObj.set({ account_id: user_data?.account_id, pageNumber: 1, pageSize: 10, keyword: '' })

    this.getAllRoles();
    this.createAssignUser(user_data?.account_id);
    this.getUserList();
  }

  ngOnInit() {

    this.searchValue.pipe(filter((value: any) => value.length >= 3 || value == ''), debounceTime(1000), distinctUntilChanged()).subscribe(
      (value: any) => {
        this.userReqObj().keyword = value;
        this.getUserList();
      });


    this.getDetailonEdit();

  }

  get formData() { return this.teamForm.controls };

  onFormSubmit() {
    return new Promise((resolve, reject) => {
      if (this.teamForm.invalid) {
        this.isFieldsValid.set(true);
        this.toastr.error("Kindly complete form.", "");
        this.communicate.isLoaderLoad.next(false);
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
        this.toastr.error("Kindly complete form", "");
        this.communicate.isLoaderLoad.next(false);
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
    new Promise((resolve, reject) => {

      const reader = new FileReader();
      reader.readAsDataURL(file_event);
      reader.onload = async () => {
        this.imgURLBase64.set(reader.result);

        if (this.imgURLBase64()) {
          resolve(true);
        } else {
          resolve(false);
        }

      };
    })
  }

  CrossBtn() {
    this.imgURLBase64.set('');
    this.teamForm.get('logo')?.setValue('');
    this.teamForm.controls['logo'].addValidators(Validators.required);
    this.teamForm.controls['logo'].updateValueAndValidity();
  }

  async onFileChange(event: any) {
    this.selectedFile = event.target.files[0]?.name
    if (event.dataTransfer) {
      let file = event.dataTransfer.files
      this.teamForm.controls['logo'].removeValidators(Validators.required);
      this.teamForm.controls['logo'].updateValueAndValidity();
      let bs64Value = await this.convertImageToBase64(file[0]);
      return
    }
    if (event.srcElement && event.srcElement != undefined) {
      let file = event.srcElement.files
      let bs64Value = await this.convertImageToBase64(file[0]);
    }
  }

  getUserList() {
    this.communicate.isLoaderLoad.next(true);
    this.api.allPostMethod("users/getUserList", this.userReqObj()).subscribe((response: any) => {
      this.communicate.isLoaderLoad.next(false);
      if (response['error'] == false) {
        response['data'] = response['data'].filter((data: any) => data.is_owner != true)
        if ((response['data'] && response['data'].length > 0)) {
          if (this.userReqObj().pageNumber == 1) {
            this.user_list.set(response['data']);
          } else {
            this.user_list.set([...this.user_list(), ...response['data']])

          }
          this.totalPages.set(response['totalPages']);
        } else {
          this.user_list.set([]);
        }
      }
    })
  }

  createAssignUser(acc_id: number) {
    this.assignUserForm = this.formbuild.group({
      account_id: new FormControl(acc_id),
      team_id: new FormControl(''),
      userList: this.formbuild.array([])
    });
  }

  async assignUserTeam() {

    if (this.assignUserForm.value.userList && this.assignUserForm.value.userList.length == 0) {
      this.showValidation.set(true);
      return;
    }
    this.communicate.isLoaderLoad.next(true);
    if (this.Teamedit()) {
      let editTeam = await this.onEditTeam();
    } else {
      let editTeam = await this.onFormSubmit();
    }

    this.assignUserForm.patchValue({
      team_id: this.team_id()
    });

    this.api.allPostMethod('team/assingUser', this.assignUserForm.value).subscribe((response: any) => {
      this.communicate.isLoaderLoad.next(false);
      if (response['error'] == true) {
        this.toastr.error("Something went wrong", "");
      } else {
        this.toastr.success("User assigned successfully.", "");
        this.router.navigate(['dashboard-detail/team']);
      }
    });
  }

  getAllRoles() {
    let get_roles = localStorage.getItem('role_list');
    if (get_roles) {
      this.role_list.set(JSON.parse(get_roles));
    }
  }

  onScroll() {
    if (this.userReqObj().pageNumber < this.totalPages()) {
      this.userReqObj().pageNumber += 1;
      this.getUserList();
    }

  }

  selectedEvent(event: any) {

    if (event.target.checked == true) {
      let idxObj = this.user_list().findIndex((data: any) => data.id == event.target.value);
      if (idxObj != -1) {
        this.user_list()[idxObj]['checked'] = true;
        this.assignUserForm.value.userList.push({ user_id: event.target.value, status: 1, checked: this.user_list()[idxObj]['checked'], username: this.user_list()[idxObj]?.f_name + ' ' + this.user_list()[idxObj]?.l_name, role: this.user_list()[idxObj]['role_master']?.role_name });
      }
    } else {
      let idx = this.assignUserForm.value.userList.findIndex((data: any) => data.user_id == event.target.value);
      if (idx != -1) {
        this.assignUserForm.value.userList.splice(idx, 1);
      }
    }
  }

  getDetailonEdit() {

    this.activeRout.queryParams.subscribe((res: any) => {
      if (res?.id) {
        this.communicate.isLoaderLoad.next(true);
        this.api.allPostMethod("team/getTeam", res).subscribe((res: any) => {
          this.communicate.isLoaderLoad.next(false);
          if (res['error'] != true) {
            this.Teamedit.set(true);
            res = res.data;
            this.teamForm.patchValue({
              name: res?.name,
              about: res?.about,
              account_id: res?.account_id
            });
            res.user_team_relations.map((data: any) => {
              let element = document.getElementById('id_' + data['account_user']?.id);
              if (element) {
                element.click()
              }
            })

            this.isActive.set(res?.status);
            this.imgURLBase64.set(res?.logo);
            this.teamForm.addControl('id', new FormControl(res?.id));
            this.teamForm.controls['logo'].removeValidators(Validators.required);
            this.teamForm.controls['logo'].updateValueAndValidity();

          }
        });
      }
    });

  }

  deleteTeam(idx: number) {
    let val = this.assignUserForm.value.userList[idx];
    let idxObj = this.user_list().findIndex((data: any) => data.id == val.user_id);
    if (idxObj != -1) {
      this.user_list()[idxObj]['checked'] = false;
    }
    this.assignUserForm.value.userList.splice(idx, 1);
  }

  viewImagePopup(){
    this.modalRef = this.modalService.open(this.content, { centered: true , size:'sm'});  // Open the modal with template reference

    // Handle modal dismiss reason (optional)
  }
  
  closeModal() {
    if (this.modalRef) {
      this.modalRef.dismiss('cross click'); // Dismiss the modal
    }
  }
}
