import { Component } from '@angular/core';
import { CommonApiService } from '../../core/services/common-api.service';
import { CommunicateService } from '../../core/services/communicate.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-department',
  templateUrl: './department.component.html',
  styleUrl: './department.component.css'
})
export class DepartmentComponent {
  departmentList:any;
  account_id:any;

  constructor(private api:CommonApiService,private communicate:CommunicateService,private toastr:ToastrService){
    let shareData: any = localStorage.getItem("Shared_Data");
    shareData = JSON.parse(shareData);
    this.account_id = shareData?.account_id;
  }

  ngOnInit(){    
    this.getDepartmentList(this.account_id)
  }

  onDeleteClient(id:number){
    this.communicate.isLoaderLoad.next(true);
    this.api.allPostMethod("departments/deleteDepartmentByID",{ id:id , account_id:this.account_id }).subscribe((res:any)=>{
      if(res && res?.message){
        this.communicate.isLoaderLoad.next(false);
        this.getDepartmentList(this.account_id)
      }else{
        this.toastr.error("Something went wrong,Please try again later","",{closeButton:true,timeOut:5000}).onHidden.subscribe(()=>{
          this.communicate.isLoaderLoad.next(false);
        })
      }
    });
  }

  getDepartmentList(account_id:number){
    this.communicate.isLoaderLoad.next(true);
    this.api.allPostMethod("departments/departmentlist",{account_id:account_id, pageNumber: 1, pageSize: 10 }).subscribe((res:any)=>{
      if(res?.['data'].length > 0){
        this.departmentList = res['data']
      }else{
        this.departmentList = []
      }
      this.communicate.isLoaderLoad.next(false);
    })
  }
}
