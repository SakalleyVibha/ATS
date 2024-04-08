import { Component } from '@angular/core';
import { CommonApiService } from '../../core/services/common-api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {

  user_list: any;
  location_list: any;

  constructor(private api: CommonApiService, private router: Router) {
    let user_data: any = localStorage.getItem('Shared_Data');
    user_data = JSON.parse(user_data);
    this.getLocationList(user_data.account_id);
  }

  ngOnInit() { }

  getUserList(account_id: number) {
    this.api.allPostMethod("users/getUserList", { account_id: account_id, pageNumber: 1, pageSize: 10 }).subscribe((getUser: any) => {
      if (getUser.data.length > 0) {
        this.user_list = getUser.data;
      } else {
        if (this.location_list && this.location_list.length > 0) {
          this.router.navigate(['create-user-location/user-detail'])
        }
        this.user_list = false;
      }

      if ((this.location_list && this.location_list.length > 0) && (this.user_list && this.user_list.length > 0)) {
        document.getElementById('skip-btn')?.click();
      }
    })
  }

  getLocationList(acc_id: number) {
    this.api.allPostMethod('locations/locationlist', { account_id: acc_id, pageNumber: 1, pageSize: 10 }).subscribe((res: any) => {
      if (res.data.length > 0) {
        this.location_list = res.data;
      } else {
        this.router.navigate(['create-user-location/location-detail'])
        this.location_list = false;
      }
      this.getUserList(acc_id);
    });
  }

  onLogout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }

}
