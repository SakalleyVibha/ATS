import { Component } from '@angular/core';
import { CommonApiService } from '../../core/services/common-api.service';

@Component({
  selector: 'app-location-detail',
  templateUrl: './location-detail.component.html',
  styleUrl: './location-detail.component.css'
})
export class LocationDetailComponent {
  location_list: any;

  constructor(private api: CommonApiService) {
    let user_data: any = localStorage.getItem('Shared_Data');
    user_data = JSON.parse(user_data);
    this.getLocationList(user_data.account_id);
  }

  getLocationList(acc_id: number) {
    this.api.allPostMethod('locations/locationlist', { account_id: acc_id, pageNumber: 1, pageSize: 10 }).subscribe((res: any) => {
      if(res.data.length > 0){
        this.location_list = res.data
      }else{
        this.location_list = false
      }
    });
  }
}
