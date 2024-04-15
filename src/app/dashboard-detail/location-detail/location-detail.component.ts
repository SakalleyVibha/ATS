import { Component } from '@angular/core';
import { CommonApiService } from '../../core/services/common-api.service';
import { CommunicateService } from '../../core/services/communicate.service';
import { ToastrService } from 'ngx-toastr';
import { FormControl, FormGroup } from '@angular/forms';
import { debounceTime } from 'rxjs';

@Component({
  selector: 'app-location-detail',
  templateUrl: './location-detail.component.html',
  styleUrl: './location-detail.component.css'
})
export class LocationDetailComponent {
  is_owner: any;
  location_list: any[] = [];
  current_role: any;
  reqObj: any;
  totalItems: number = 0;

  searchByKey: FormGroup = new FormGroup({
    keyword: new FormControl()
  });


  constructor(private api: CommonApiService, private communicate: CommunicateService, private toastr: ToastrService) {
    this.current_role = localStorage.getItem('role');
    this.current_role = JSON.parse(this.current_role);

    let shareData: any = localStorage.getItem("Shared_Data");
    shareData = JSON.parse(shareData);
    this.is_owner = shareData?.is_owner;
    this.reqObj = {
      account_id: shareData?.account_id,
      pageNumber: 1,
      pageSize: 10
    };

  }

  ngOnInit() {
    let obs = this.searchByKey.valueChanges
      .pipe(debounceTime(1000))
      .subscribe(data => {
        if (data['keyword'] && data['keyword'].length > 2) {
          this.location_list = [];
          this.reqObj['keyword'] = data['keyword'];
          this.getLocation();
        }
        if (data['keyword'] == '') {
          this.location_list = [];
          this.reqObj['keyword'] = '';
          this.getLocation();
        }
      });
    this.getLocation();
  }

  getLocation() {
    this.communicate.isLoaderLoad.next(true);
    this.api.allPostMethod('locations/locationlist', this.reqObj).subscribe((res: any) => {
      this.communicate.isLoaderLoad.next(false);
      if (res['error'] != true) {
        if (res['data'] && res['data'].length > 0) {
          this.location_list.push(...res['data']);
          this.totalItems = res['totalItems'];
        } else {
          this.location_list = [];
        }
      }
    })
  }

  deleteLocation(id: number) {
    this.communicate.isLoaderLoad.next(true);
    this.api.allPostMethod('locations/deletelocation', { id: id, account_id: this.reqObj.account_id }).subscribe((res: any) => {
      this.communicate.isLoaderLoad.next(false);
      this.getLocation();
      if (res.data && res.data > 0) {
        this.toastr.success("Location deleted successfully", "", { closeButton: true, timeOut: 5000 }).onHidden.subscribe(() => { })
      }
    });

  }


  onScroll() {
    if (this.location_list && (this.location_list.length < this.totalItems)) {
      this.reqObj.pageNumber += 1;
      this.getLocation();
    }
  }

}
