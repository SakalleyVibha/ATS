import { Component } from '@angular/core';
import { CommonApiService } from '../../core/services/common-api.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {


  accountDetail: any;
  is_owner: any;
  role_permission: any;

  constructor(private api: CommonApiService) {
    this.role_permission = localStorage.getItem("role");
    this.role_permission = JSON.parse(this.role_permission);
  }

  ngOnInit() {
    let shareData: any = localStorage.getItem('Shared_Data');
    shareData = JSON.parse(shareData);
    this.getAccount(shareData);
  }

  getAccount(shareData: any) {
    this.api.allgetMethod('accounts/account').subscribe((res: any) => {
      this.is_owner = shareData?.is_owner;
      if (!res['data']) {
        console.log("Add Account");
        // this.whichBtn = 'Account';
      } else {
        // if (res['data'].length == 1) {
        localStorage.setItem('Shared_Data', JSON.stringify({ ...shareData, account_id: res['data'][0].id }));
        this.accountDetail = res['data'][0];
        console.log("Add Location");
        // this.whichBtn = 'Location';
        // }
      }
    })
  }


}
