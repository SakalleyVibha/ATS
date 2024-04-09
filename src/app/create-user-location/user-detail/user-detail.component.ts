import { Component } from '@angular/core';
import { CommonApiService } from '../../core/services/common-api.service';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrl: './user-detail.component.css'
})
export class UserDetailComponent {
  user_list: any;
  Date = new Date();
  current_role: any;

  constructor(private api: CommonApiService) {
    this.current_role = localStorage.getItem('role');
    this.current_role = JSON.parse(this.current_role);
    console.log('this.current_role: ', this.current_role);
    let user_data: any = localStorage.getItem('Shared_Data');
    user_data = JSON.parse(user_data);
    this.getUserList(user_data.account_id);
  }

  getUserList(account_id: number) {
    this.api.allPostMethod("users/getUserList", { account_id: account_id, pageNumber: 1, pageSize: 10 }).subscribe((getUser: any) => {
      if (getUser.data.length > 0) {
        this.user_list = getUser.data;
      } else {
        this.user_list = false;
      }
    })
  }
}
