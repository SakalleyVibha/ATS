import { Component } from '@angular/core';
import { CommonApiService } from '../core/services/common-api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-user-location',
  templateUrl: './create-user-location.component.html',
  styleUrl: './create-user-location.component.css'
})
export class CreateUserLocationComponent {

  current_status: any;

  constructor(private api: CommonApiService,private router:Router) {
    this.current_status = {
      location: false,
      user: false
    };
    let user_data: any = localStorage.getItem('Shared_Data');
    user_data = JSON.parse(user_data);

    this.getLocationList(user_data.account_id);
    this.getClientList(user_data.account_id);
    this.RoutingPage();
  }

  ngOnInit() {

  }

  getLocationList(acc_id: number) {
    this.api.allPostMethod('locations/locationlist', { account_id: acc_id, pageNumber: 1, pageSize: 10 }).subscribe((res: any) => {
      this.current_status.location = res['totalItems'] > 0;
      console.log('this.current_status.location: ', this.current_status.location);
    });
  }

  getClientList(acc_id: number) {
    this.api.allPostMethod('users/getUserList', { account_id: acc_id, pageNumber: 1, pageSize: 10 }).subscribe((res: any) => {
      this.current_status.user = res['totalItems'] > 0;
      console.log('this.current_status.user: ', this.current_status.user);
    });
  }

  RoutingPage(){
    // if((this.current_status.location == 0 && this.current_status.user == 0) || (this.current_status.location == 0 && this.current_status.user == 1)){
    //   this.router.navigate(['create-user-location/location-detail']);
    // }
    // if((this.current_status.location == 1 && this.current_status.user == 0)){
    //   this.router.navigate(['create-user-location/user-detail']);
    // }
  }

}
