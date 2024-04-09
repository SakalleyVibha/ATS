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
    console.log('shareData: ', shareData);
    shareData.account_id = 29;
    this.api.allgetMethod('accounts/account').subscribe((res: any) => {
      this.is_owner = shareData?.is_owner;
      if (res['data']) {
        this.accountDetail = res['data'].find((data: any) => data.id == shareData.account_id);
        console.log('res[data]: ', res['data']);
        console.log('this.accountDetail: ', this.accountDetail);
      } else {

      }
    })
  }


}
