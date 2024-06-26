import { Component, signal } from '@angular/core';
import { CommonApiService } from '../../core/services/common-api.service';
import { CommunicateService } from '../../core/services/communicate.service';
import { ToastrService } from 'ngx-toastr';
import { Subject, debounceTime, distinctUntilChanged, filter } from 'rxjs';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrl: './user-detail.component.css'
})
export class UserDetailComponent {
  user_list = signal<any>([]);
  Date = new Date();
  current_role: any;
  user_data: any;
  searchValue: string = ''
  searchData = new Subject<Event>();
  reqObj: any;
  totalPages: any;

  constructor(private api: CommonApiService, private communicate: CommunicateService, private toastr: ToastrService) {
    this.current_role = localStorage.getItem('role');
    this.current_role = JSON.parse(this.current_role);
    console.log('this.current_role: ', this.current_role);
    this.user_data = localStorage.getItem('Shared_Data');
    this.user_data = JSON.parse(this.user_data);
    this.reqObj = {
      account_id: this.user_data.account_id,
      pageNumber: 1,
      pageSize: 10,
      keyword: ''
    }
    this.getUserList();
  }

  ngOnInit() {
    this.searchData.pipe(filter((x: any) => x.length >= 3 || x == ''), debounceTime(1000), distinctUntilChanged()).
      subscribe((data: any) => {
        this.user_list.set([]);
        this.reqObj.pageNumber = 1;
        this.reqObj.keyword = data;
        this.getUserList();
      });
  }

  getUserList() {
    this.communicate.isLoaderLoad.next(true);
    this.api.allPostMethod("users/getUserList", this.reqObj).subscribe((getUser: any) => {
      this.communicate.isLoaderLoad.next(false);
      if (getUser['error'] != true) {
        if ((getUser['data'] && getUser['data'].length > 0)) {
          if (this.reqObj.pageNumber == 1) {
            this.user_list.set(getUser['data']);
          } else
            this.user_list.update(x => {
              return [...x, ...getUser['data']]
            })
          this.totalPages = getUser['totalPages'];
        } else {
          this.user_list.set([]);
        }
      }
    })
  }

  deleteUser(id: number) {
    this.communicate.isLoaderLoad.next(true);
    this.api.allPostMethod('users/deleteUserProfile', { id: id, account_id: this.reqObj?.account_id }).subscribe((res: any) => {
      this.communicate.isLoaderLoad.next(false);
      if (res['error'] != true) {
        this.reqObj.pageNumber = 1;
        this.user_list.set([]);
        this.getUserList();
        this.toastr.success("User deleted successfully", "")
      } else {
        this.toastr.error(res['message'], "");
      }
    });
  }

  onScroll() {
    if (this.reqObj.pageNumber < this.totalPages) {
      this.reqObj.pageNumber += 1;
      this.getUserList();
    }
  }
}
