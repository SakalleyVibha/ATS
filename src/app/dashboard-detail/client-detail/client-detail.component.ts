import { Component } from '@angular/core';
import { CommonApiService } from '../../core/services/common-api.service';
import { CommunicateService } from '../../core/services/communicate.service';
import { ToastrService } from 'ngx-toastr';
import { FormControl, FormGroup } from '@angular/forms';
import { debounceTime } from 'rxjs';

@Component({
  selector: 'app-client-detail',
  templateUrl: './client-detail.component.html',
  styleUrl: './client-detail.component.css'
})
export class ClientDetailComponent {

  clientList: any[] = [];
  current_role: any;
  reqObj: any;
  totalPages: number = 0;

  searchByKey: FormGroup = new FormGroup({
    keyword: new FormControl()
  });

  constructor(private api: CommonApiService, private communicate: CommunicateService, private toastr: ToastrService) {

    this.current_role = localStorage.getItem('role');
    this.current_role = JSON.parse(this.current_role);

    let user_data: any = localStorage.getItem('Shared_Data');
    user_data = JSON.parse(user_data);
    this.reqObj = {
      account_id: user_data?.account_id,
      pageNumber: 1,
      pageSize: 10
    };
  }

  ngOnInit() {
    let obs = this.searchByKey.valueChanges
      .pipe(debounceTime(1000))
      .subscribe(data => {
        if (data['keyword'] && data['keyword'].length > 2) {
          this.clientList = [];
          this.reqObj['keyword'] = data['keyword'];
          this.getClientList();
        }
        if (data['keyword'] == '') {
          this.clientList = [];
          this.reqObj['keyword'] = '';
          this.getClientList();
        }
      });

    this.getClientList();
  }

  getClientList() {

    this.communicate.isLoaderLoad.next(true);
    this.api.allPostMethod('clients/clientlist', this.reqObj).subscribe((res: any) => {
      this.communicate.isLoaderLoad.next(false);
      if (res['error'] != true) {
        if ((res['data'] && res['data'].length > 0)) {
          if(this.reqObj.pageNumber == 1){
            this.clientList = res['data'];
          } else
          this.clientList.push(...res['data']);
          this.totalPages = res['totalPages'];
        } else {
          this.clientList = [];
        }
      }
    });
  }

  deleteClient(id: number) {
    this.communicate.isLoaderLoad.next(true);
    this.api.allPostMethod('clients/deleteclient', { id: id, account_id: this.reqObj.account_id }).subscribe((res: any) => {
      this.communicate.isLoaderLoad.next(false);
      this.reqObj.pageNumber = 1;
      this.getClientList();
      if (res.data && res.data > 0) {
        this.toastr.success("Client deleted successfully", "", { closeButton: true, timeOut: 5000 }).onHidden.subscribe(() => { })
      }

    });
  }

  onScroll() {
    if ( this.reqObj.pageNumber < this.totalPages) {
      this.reqObj.pageNumber += 1;
      this.getClientList();
    }
  }

}
