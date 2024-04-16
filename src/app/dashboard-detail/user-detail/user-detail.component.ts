import { Component } from '@angular/core';
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
  user_list: any;
  Date = new Date();
  current_role: any;
  user_data: any;
  searchValue:string= ''
  searchData = new Subject<Event>();
  reqObj : any;
  constructor(private api: CommonApiService, private communicate: CommunicateService, private toastr: ToastrService) {
    this.current_role = localStorage.getItem('role');
    this.current_role = JSON.parse(this.current_role);
    console.log('this.current_role: ', this.current_role);
    this.user_data = localStorage.getItem('Shared_Data');
    this.user_data = JSON.parse(this.user_data);
    this.reqObj = {
      account_id : this.user_data.account_id,
      pageNumber: 1, 
      pageSize: 10,
      keyword: ''
    }
    this.getUserList();
  }

  ngOnInit(){
    this.searchData.pipe(filter((x:any)=> x.length >=0 || x == ''),debounceTime(1000),distinctUntilChanged()).
    subscribe((data:any)=>{
      this.reqObj.keyword = data;
      this.getUserList();
    });
  }

  getUserList() {
    this.communicate.isLoaderLoad.next(true);
    this.api.allPostMethod("users/getUserList", this.reqObj).subscribe((getUser: any) => {
      if (getUser.data.length > 0) {
        this.user_list = getUser.data;
      } else {
        this.user_list = [];
      }
      this.communicate.isLoaderLoad.next(false);
    })
  }

  deleteUser(id: number) {
    this.communicate.isLoaderLoad.next(true);
    this.api.allPostMethod('users/deleteUserProfile', { id: id, account_id: this.reqObj?.account_id }).subscribe((res: any) => {
      this.communicate.isLoaderLoad.next(false);
      this.getUserList();
      if (res.data && res.data > 0) {
        this.toastr.success("User deleted successfully", "", { closeButton: true, timeOut: 5000 }).onHidden.subscribe(() => { })
      }
    });
  }
}
