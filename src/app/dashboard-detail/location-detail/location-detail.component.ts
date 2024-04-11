import { Component } from '@angular/core';
import { CommonApiService } from '../../core/services/common-api.service';
import { CommunicateService } from '../../core/services/communicate.service';

@Component({
  selector: 'app-location-detail',
  templateUrl: './location-detail.component.html',
  styleUrl: './location-detail.component.css'
})
export class LocationDetailComponent {
  is_owner: any;
  location_list: any;
  current_role: any;

  constructor(private api: CommonApiService,private communicate:CommunicateService) {
    this.current_role = localStorage.getItem('role');
    this.current_role = JSON.parse(this.current_role);
    console.log('this.current_role: ', this.current_role);
    let shareData: any = localStorage.getItem("Shared_Data");
    shareData = JSON.parse(shareData);
    this.is_owner = shareData?.is_owner;
    this.getLocation(shareData?.account_id);
  }

  ngOnInit() { }

  getLocation(acc_id: number) {
    this.communicate.isLoaderLoad.next(true);
    this.api.allPostMethod('locations/locationlist', { account_id: acc_id, pageNumber: 1, pageSize: 10 }).subscribe((res: any) => {
      console.log(acc_id," && ",res);
      if (res['data']) {
        this.location_list = res['data'];
        // console.log('this.locationList: ', this.location_list);
        // this.whichBtn = 'Account';
      }
    })
    this.communicate.isLoaderLoad.next(false);
  }

}
