import { Component } from '@angular/core';
import { CommonApiService } from '../../core/services/common-api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-location-detail',
  templateUrl: './location-detail.component.html',
  styleUrl: './location-detail.component.css'
})
export class LocationDetailComponent {
  location_list: any;
  current_role: any;
  is_owner: boolean | undefined;

  constructor(private api: CommonApiService, private router: Router) {
    this.current_role = localStorage.getItem('role');
    this.current_role = JSON.parse(this.current_role);
    console.log('this.current_role: ', this.current_role);

    let user_data: any = localStorage.getItem('Shared_Data');
    user_data = JSON.parse(user_data);
    this.is_owner = user_data.is_owner;
    this.getLocationList(user_data.account_id);
  }

  getLocationList(acc_id: number) {
    this.api.allPostMethod('locations/locationlist', { account_id: acc_id, pageNumber: 1, pageSize: 10 }).subscribe((res: any) => {
      if (res.data.length > 0) {
        this.location_list = res.data;
        this.router.navigate(['/create-user-location/user-detail']);
      } else {
        this.location_list = false
      }
    });
  }
}
