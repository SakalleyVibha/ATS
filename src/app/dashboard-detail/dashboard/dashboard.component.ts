import { Component } from '@angular/core';
import { CommonApiService } from '../../core/services/common-api.service';
import { CommunicateService } from '../../core/services/communicate.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {


  accountDetail: any;
  is_owner: any;
  role_permission: any;

  constructor(private api: CommonApiService,private communicate:CommunicateService) {
    this.role_permission = localStorage.getItem("role");
    this.role_permission = JSON.parse(this.role_permission);
  }

  ngOnInit() {
    let shareData: any = localStorage.getItem('Shared_Data');
    shareData = JSON.parse(shareData);
    this.getAccount(shareData);
  }

  getAccount(shareData: any) {
    this.communicate.isLoaderLoad.next(true);
    this.api.allgetMethod('accounts/account', {}).subscribe((res: any) => {
      this.is_owner = shareData?.is_owner;
      if (res['data']) {
        this.accountDetail = res['data'].find((data: any) => data.id == shareData.account_id);
        console.log('res[data]: ', res['data']);
        console.log('this.accountDetail: ', this.accountDetail);
      } else {
      }
      this.communicate.isLoaderLoad.next(false);
    })
  }


}
