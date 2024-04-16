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
  totalPage:Number = 0;
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
      this.paginationData.pageNumber = 1;
      this.getDepartmentList();
    });
  }

  onDeleteClient(id:number){
    this.communicate.isLoaderLoad.next(true);
    this.api.allPostMethod("departments/deleteDepartmentByID",{ id:id , account_id:this.paginationData.account_id }).subscribe((res:any)=>{
      if(res?.message){
        this.communicate.isLoaderLoad.next(false);
        this.paginationData.pageNumber = 1;
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
    this.api.allPostMethod("departments/departmentlist",this.paginationData).subscribe((res:any)=>{
      if(res?.['data'].length > 0){
        if(this.paginationData.pageNumber == 1){
          this.departmentList = res['data'];
        }else {
          this.departmentList.push(...res['data']);
        }
        this.totalPage = res['totalPages'];
      }else{
        this.departmentList = []
      }
      this.communicate.isLoaderLoad.next(false);
    })
  }

  onScroll(){
    if(this.paginationData.pageNumber < this.totalPage){
      this.paginationData.pageNumber += 1;
      this.getDepartmentList();
    }
  }
}
