import { Component } from '@angular/core';
import { CommonApiService } from '../../core/services/common-api.service';

@Component({
  selector: 'app-client-detail',
  templateUrl: './client-detail.component.html',
  styleUrl: './client-detail.component.css'
})
export class ClientDetailComponent {

  clientList: any;

  constructor(private api: CommonApiService) {

    let user_data: any = localStorage.getItem('Shared_Data');
    user_data = JSON.parse(user_data);
    this.getClientList(user_data.account_id);
  }

  ngOnInit() { }

  getClientList(acc_id: number) {
    this.api.allPostMethod('clients/clientlist', { account_id: 0, pageNumber: 1, pageSize: 10 }).subscribe((res: any) => {
      if(res.error == true){
        this.clientList = false;
      }else{
        this.clientList = res['data'];
      }
    });
  }

}
