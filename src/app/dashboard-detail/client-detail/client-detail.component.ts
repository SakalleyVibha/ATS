import { Component } from '@angular/core';
import { CommonApiService } from '../../core/services/common-api.service';

@Component({
  selector: 'app-client-detail',
  templateUrl: './client-detail.component.html',
  styleUrl: './client-detail.component.css'
})
export class ClientDetailComponent {

  clientList: any;
  current_role: any;

  constructor(private api: CommonApiService) {

    this.current_role = localStorage.getItem('role');
    this.current_role = JSON.parse(this.current_role);
    console.log('this.current_role: ', this.current_role);

    let user_data: any = localStorage.getItem('Shared_Data');
    user_data = JSON.parse(user_data);
    this.getClientList(user_data.account_id);
  }

  ngOnInit() { }

  getClientList(acc_id: number) {
    this.api.allPostMethod('clients/clientlist', { account_id: acc_id, pageNumber: 1, pageSize: 10 }).subscribe((res: any) => {
      if(res.error == true){
        this.clientList = false;
      }else{
        this.clientList = res['data'];
      }
    });
  }

}
