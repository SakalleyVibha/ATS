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
  roleList:any = [];
  searchValue = new Subject<Event>();
  searchString:string = ''  
  totalPage:number = 0;
  payload = {
    pageNumber: 1,
    pageSize: 10,
    keyword: ''
 }

  constructor(private api:CommonApiService,private toastr:ToastrService,private communicate:CommunicateService){}

  ngOnInit(){
    let user_data: any = localStorage.getItem('Shared_Data');
    user_data = JSON.parse(user_data);
    this.getRoleList();
    this.searchValue.pipe(filter((value:any)=> value.length >= 3 || value == ''),debounceTime(1000),distinctUntilChanged()).subscribe(
      (value:any)=>{
      this.payload.keyword = value;
      this.payload.pageNumber = 1;
      this.roleList = []
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
          this.toastr.error(res.message || res.error,"",{closeButton:true,timeOut:5000}).onHidden.subscribe(()=>{
            this.communicate.isLoaderLoad.next(false);
          });
        }
      }
    });
  }

  getRoleList(){
    this.communicate.isLoaderLoad.next(true);
    this.api.allPostMethod("role/roles",this.payload).subscribe((res:any)=>{
      this.communicate.isLoaderLoad.next(false);
      if(!res.error){
         this.roleList = [...this.roleList,...res.data]
      }else{
        this.toastr.error(res.message || res.error,"",{closeButton:true,timeOut:5000}).onHidden.subscribe(()=>{
          this.communicate.isLoaderLoad.next(false);
        });
        console.log(res.message || res.error)
      }
    
    });
  }

  onScroll(){
   this.payload.pageNumber += 1;
  }
}
