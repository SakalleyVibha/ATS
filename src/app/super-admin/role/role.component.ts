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
  paginationData:any;
  totalPage:number = 0;

  constructor(private api:CommonApiService,private toastr:ToastrService,private communicate:CommunicateService){}

  ngOnInit(){
    let user_data: any = localStorage.getItem('Shared_Data');
    user_data = JSON.parse(user_data);
    this.paginationData = {
      account_id :user_data?.account_id,
      pageNumber: 1, 
      pageSize: 10,
      keyword:''
    }
    this.getRoleList();
    this.searchValue.pipe(filter((value:any)=> value.length >= 3 || value == ''),debounceTime(1000),distinctUntilChanged()).subscribe(
      (value:any)=>{
      this.paginationData.keyword = value;
      this.paginationData.pageNumber = 1;
      this.getRoleList();
    });
  }

  onDeleteRole(id:number){
    this.communicate.isLoaderLoad.next(true);
    this.api.allPostMethod("role/deleterole",{ id }).subscribe({
      next: (res:any)=>{
        if(!res.error){
          this.toastr.success(res.message,"",{closeButton:true,timeOut:5000}).onHidden.subscribe(()=>{
            this.communicate.isLoaderLoad.next(false);
          });
        }else{
          this.toastr.error(res.message,"",{closeButton:true,timeOut:5000}).onHidden.subscribe(()=>{
            this.communicate.isLoaderLoad.next(false);
          });
        }
      }
    });
  }

  getRoleList(){
    this.communicate.isLoaderLoad.next(true);
    this.api.allgetMethod("role/roles",{}).subscribe((res:any)=>{
      if(res?.data.length > 0){
        if(this.paginationData.pageNumber == 1){
          this.roleList = res?.data;
        }else{
          this.roleList.push(...res.data);
        }
        this.totalPage = res.totalPages;
      }else{
        this.roleList = [];
      }
      this.communicate.isLoaderLoad.next(false);
    });
  }

  onScroll(){
    if(this.paginationData.pageNumber < this.totalPage){
      this.paginationData.pageNumber += 1;
      this.getRoleList();
    }
  }
}