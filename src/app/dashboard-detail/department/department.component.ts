import { Component } from '@angular/core';
import { CommonApiService } from '../../core/services/common-api.service';
import { CommunicateService } from '../../core/services/communicate.service';
import { ToastrService } from 'ngx-toastr';
import { Subject, debounceTime, distinctUntilChanged, filter } from 'rxjs';

@Component({
  selector: 'app-department',
  templateUrl: './department.component.html',
  styleUrl: './department.component.css'
})
export class DepartmentComponent {
  departmentList:any;
  searchDepartment:string = '';
  searchValue = new Subject<Event>();
  paginationData :any;

  constructor(private api:CommonApiService,private communicate:CommunicateService,private toastr:ToastrService){
    let shareData: any = localStorage.getItem("Shared_Data");
    shareData = JSON.parse(shareData);
    this.paginationData = {
      keyword:'',
      account_id : shareData?.account_id,
      pageNumber: 1, 
      pageSize: 10
    }
  }

  ngOnInit(){    
    this.getDepartmentList()
    this.searchValue.pipe(filter((value:any)=> value.length >= 3 || value == ''),debounceTime(1000),distinctUntilChanged()).subscribe((value:any)=>{
      this.paginationData.keyword = value;
      this.getDepartmentList();
    });
  }

  onDeleteClient(id:number){
    this.communicate.isLoaderLoad.next(true);
    this.api.allPostMethod("departments/deleteDepartmentByID",{ id:id , account_id:this.paginationData.account_id }).subscribe((res:any)=>{
      if(res?.message){
        this.communicate.isLoaderLoad.next(false);
        this.getDepartmentList()
      }else{
        this.toastr.error("Something went wrong,Please try again later","",{closeButton:true,timeOut:5000}).onHidden.subscribe(()=>{
          this.communicate.isLoaderLoad.next(false);
        });
      }
    });
  }

  getDepartmentList(){
    this.communicate.isLoaderLoad.next(true);
    this.api.allPostMethod("departments/departmentlist",{account_id:this.paginationData.account_id, pageNumber: this.paginationData.pageNumber, pageSize: this.paginationData.pageSize , keyword: this.paginationData.keyword }).subscribe((res:any)=>{
      if(res?.['data'].length > 0){
        this.departmentList = res['data']
      }else{
        this.departmentList = []
      }
      this.communicate.isLoaderLoad.next(false);
    })
  }
}
