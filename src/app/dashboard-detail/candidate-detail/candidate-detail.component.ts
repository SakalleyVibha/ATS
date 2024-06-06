import { Component, signal } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged, filter } from 'rxjs';
import { CommonApiService } from '../../core/services/common-api.service';
import { CommunicateService } from '../../core/services/communicate.service';
import { ToastrService } from 'ngx-toastr';
import { PERMISSIONS } from '../../core/Constants/permissions.constant';
import { Location } from '@angular/common';

@Component({
  selector: 'app-candidate-detail',
  templateUrl: './candidate-detail.component.html',
  styleUrl: './candidate-detail.component.css'
})
export class CandidateDetailComponent {
  candidateList = signal<Array<any>>([]);
  current_role = signal<any>({});
  reqObj: any;
  totalPages: number = 0;
  searchByKey: FormControl = new FormControl('');
  searchValue = new Subject<Event>();
  searchString: string = '';
  permissions = {
    canAdd: true,
    canEdit: true,
    canDelete: true
  }

  constructor(private api: CommonApiService, private communicate: CommunicateService, private toastr: ToastrService,private location: Location) {
    this.current_role.set(localStorage.getItem('role'));
    this.current_role.set(JSON.parse(this.current_role()));
    let user_data: any = localStorage.getItem('Shared_Data');
    user_data = JSON.parse(user_data);
    if(!user_data.is_owner){
      let permissiontoken = localStorage.getItem('permissiontoken');
      permissiontoken = this.communicate.decryptText(permissiontoken);
      this.permissions.canAdd = permissiontoken? permissiontoken.includes(PERMISSIONS.Add_Candidate): false;
      this.permissions.canEdit = permissiontoken? permissiontoken.includes(PERMISSIONS.Edit_Candidate): false;
      this.permissions.canDelete = permissiontoken? permissiontoken.includes(PERMISSIONS.Delete_Candidate): false;
    }
    this.reqObj = {
      account_id: user_data?.account_id,
      pageNumber: 1,
      pageSize: 10,
      keyword: ''
    };
  }

  ngOnInit() {
    this.searchValue.pipe(filter((value: any) => value.length >= 3 || value == ''), debounceTime(1000), distinctUntilChanged()).subscribe(
      (value: any) => {
        this.reqObj.keyword = value;
        this.reqObj.pageNumber = 1;
        this.getCandidateList();
      });
    this.getCandidateList();
  }

  getCandidateList() {
    this.communicate.isLoaderLoad.next(true);
    this.api.allPostMethod('candidates/candidateList', this.reqObj).subscribe((res: any) => {
      this.communicate.isLoaderLoad.next(false);
      if (res['error'] != true) {
        if ((res['data'] && res['data'].length > 0)) {
          if (this.reqObj.pageNumber == 1) {
            this.candidateList.set(res['data']);
          } else
            this.candidateList.update(x => {
              return [...x, ...res['data']]
            })
          this.totalPages = res['totalPages'];
        } else {
          this.candidateList.set([]);
        }
      }
    });
  }

  deleteCandidate(id: number) {
    return
    this.communicate.isLoaderLoad.next(true);
    this.api.allPostMethod('team/deleteclient', { id: id, account_id: this.reqObj.account_id }).subscribe((res: any) => {
      this.communicate.isLoaderLoad.next(false);
      if (res['error'] != true) {
        this.reqObj.pageNumber = 1;
        this.getCandidateList();
        if (res.data && res.data > 0) {
          this.toastr.success("Candidate deleted successfully", "")
        }
      } else {
        this.toastr.error(res['message'], "")
      }
    });
  }

  onScroll() {
    if (this.reqObj.pageNumber < this.totalPages) {
      this.reqObj.pageNumber += 1;
      this.getCandidateList();
    }
  }
}
