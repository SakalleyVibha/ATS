import { Component } from '@angular/core';
import { CommonApiService } from '../../core/services/common-api.service';

@Component({
  selector: 'app-location-detail',
  templateUrl: './location-detail.component.html',
  styleUrl: './location-detail.component.css'
})
export class LocationDetailComponent {
  is_owner: any;
  location_list: any;

  constructor(private api: CommonApiService) {
    let shareData: any = localStorage.getItem("Shared_Data");
    shareData = JSON.parse(shareData);
    this.is_owner = shareData?.is_owner;
    this.getLocation(shareData?.account_id);
  }

  ngOnInit() { }

  getLocation(acc_id: number) {
    this.api.allPostMethod('locations/locationlist', { account_id: acc_id, pageNumber: 1, pageSize: 10 }).subscribe((res: any) => {
      if (res['data']) {
        this.location_list = res['data'];
        // console.log('this.locationList: ', this.location_list);
        // this.whichBtn = 'Account';
      }
    })
  }

}
