import { Component } from '@angular/core';
import { CommonApiService } from '../../core/services/common-api.service';
import { CommunicateService } from '../../core/services/communicate.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrl: './role.component.css'
})
export class RoleComponent {
  roleList:any;
  account_id:any;

  constructor(private api:CommonApiService,private toastr:ToastrService,private communicate:CommunicateService){}

  ngOnInit(){
    let user_data: any = localStorage.getItem('Shared_Data');
    user_data = JSON.parse(user_data);
    this.account_id = user_data?.account_id; 
    this.getRoleList(user_data?.account_id);
  }

  onDeleteRole(id:number){
    this.communicate.isLoaderLoad.next(true);
    this.api.allPostMethod("job-role/deleteJobRoleById",{id:id,account_id:this.account_id}).subscribe((res:any)=>{
      if(res && res?.message){
        this.communicate.isLoaderLoad.next(false);
        this.getRoleList(this.account_id);
      }else{
        this.toastr.error("Something went wrong.Please try again later","",{closeButton:true,timeOut:5000}).onHidden.subscribe(()=>{
          this.communicate.isLoaderLoad.next(false);
        })
      }
    });
  }

  getRoleList(acc_id:any){
    this.communicate.isLoaderLoad.next(true);
    this.api.allPostMethod("job-role/jobRolelist",{ account_id: acc_id, pageNumber: 1, pageSize: 10 }).subscribe((res:any)=>{
      if(res && res?.data){
        this.roleList = res?.data
      }else{
        this.roleList = false;
      }
      this.communicate.isLoaderLoad.next(false);
    })
  }
}
