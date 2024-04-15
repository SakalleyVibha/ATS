import { Component } from '@angular/core';
import { CommonApiService } from '../../core/services/common-api.service';
import { CommunicateService } from '../../core/services/communicate.service';
import { ToastrService } from 'ngx-toastr';
import { Subject, debounceTime, distinctUntilChanged, filter } from 'rxjs';

@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrl: './role.component.css'
})
export class RoleComponent {
  roleList:any;
  searchValue = new Subject<Event>();
  searchString:string = ''
  paginationData = {
    account_ID :0,
    pageNumber: 1, 
    pageSize: 10,
    keyword:''
  }

  constructor(private api:CommonApiService,private toastr:ToastrService,private communicate:CommunicateService){}

  ngOnInit(){
    let user_data: any = localStorage.getItem('Shared_Data');
    user_data = JSON.parse(user_data);
    this.paginationData.account_ID = user_data?.account_id
    this.getRoleList();
    this.searchValue.pipe(filter((value:any)=> value.length >= 3 || value == ''),debounceTime(1000),distinctUntilChanged()).subscribe(
      (value:any)=>{
      this.paginationData.keyword = value;
      this.getRoleList();
    });
  }

  onDeleteRole(id:number){
    this.communicate.isLoaderLoad.next(true);
    this.api.allPostMethod("job-role/deleteJobRoleById",{id:id,account_id:this.paginationData?.account_ID}).subscribe((res:any)=>{
      if(res?.message){
        this.communicate.isLoaderLoad.next(false);
        this.getRoleList();
      }else{
        this.toastr.error("Something went wrong.Please try again later","",{closeButton:true,timeOut:5000}).onHidden.subscribe(()=>{
          this.communicate.isLoaderLoad.next(false);
      });
      }
    });
  }

  getRoleList(){
    this.communicate.isLoaderLoad.next(true);
    this.api.allPostMethod("job-role/jobRolelist",{keyword: this.paginationData?.keyword, account_id: this.paginationData.account_ID, pageNumber: this.paginationData.pageNumber, pageSize: this.paginationData.pageSize }).subscribe((res:any)=>{
      if(res?.data.length > 0){
        this.roleList = res?.data;
      }else{
        this.roleList = [];
      }
      this.communicate.isLoaderLoad.next(false);
    });
  }
}
