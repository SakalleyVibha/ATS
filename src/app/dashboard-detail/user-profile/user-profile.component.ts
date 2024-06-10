import { Component, signal } from '@angular/core';
import { CommonApiService } from '../../core/services/common-api.service';
import { CommunicateService } from '../../core/services/communicate.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css'
})
export class UserProfileComponent {

  userData = signal<any>({});
  teamList = signal<any>([]);
  loader = signal<boolean>(false);

  constructor(private api: CommonApiService, private communicate: CommunicateService, private toastr: ToastrService) {

  }

  ngOnInit() {
    let user_data: any = localStorage.getItem('Shared_Data');
    user_data = JSON.parse(user_data);
    console.log('user_data: ', user_data);
    if (user_data?.is_owner == false) {
      this.getUserDetails({ id: user_data?.user_id, account_id: user_data?.account_id });
      this.getTeamList({ id: user_data?.user_id, account_id: user_data?.account_id });
    }
  }

  getUserDetails(data: any) {
    this.communicate.isLoaderLoad.next(true);
    this.api.allPostMethod("users/getUser", data).subscribe((res: any) => {
      this.communicate.isLoaderLoad.next(false);
      if (res['error'] != true) {
        this.userData.set(res['data']);
        console.log('this.userData: ', this.userData());
      } else {
        this.toastr.error(res['message'], "")
      }
    });
  }

  getTeamList(data: any) {
    this.loader.set(true);
    this.api.allPostMethod("team/get-user-team", data).subscribe((res: any) => {
      this.loader.set(false);
      console.log('res: ', res);
      if (res['error'] != true) {
        console.log('res.data: ', res['data']);
        this.teamList.set(res['data']);
      } else {
        this.toastr.error(res['message'], "")
      }
    });
  }

}
