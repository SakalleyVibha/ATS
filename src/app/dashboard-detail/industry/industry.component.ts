import { Component } from '@angular/core';
import { CommonApiService } from '../../core/services/common-api.service';
import { CommunicateService } from '../../core/services/communicate.service';
import { ToastrService } from 'ngx-toastr';
import { Subject, debounceTime, distinctUntilChanged,filter } from 'rxjs';

@Component({
  selector: 'app-industry',
  templateUrl: './industry.component.html',
  styleUrl: './industry.component.css'
})
export class IndustryComponent {
  industryList:any;
  searchIndustry:string = '';
  searchValue = new Subject<Event>();
  totalPage:number = 0;
  paginationData:any;

  constructor(private api:CommonApiService,private communicate:CommunicateService,private toastr:ToastrService){}

  ngOnInit(){
    let shareData: any = localStorage.getItem("Shared_Data");
    shareData = JSON.parse(shareData);
    this.paginationData = {
      account_id :shareData.account_id,
      pageNumber: 1, 
      pageSize: 10,
      keyword:''
    }
    this.getIndustryList();
    this.searchValue.pipe(filter((value:any)=> value.length >= 3 || value == ''),debounceTime(1000),distinctUntilChanged()).subscribe((value:any)=>{
      this.paginationData.keyword = value;
      this.paginationData.pageNumber = 1;
      this.getIndustryList();
    });
  }

  onDeleteIndustry(id:number){
    this.communicate.isLoaderLoad.next(true);
    this.api.allPostMethod("industry/deleteindustries",{id:id,account_id:this.paginationData.account_id}).subscribe((res:any)=>{
      if(res && res?.message){
        this.communicate.isLoaderLoad.next(false);   
        this.paginationData.pageNumber = 1;     
        this.getIndustryList();
      }else{
        this.toastr.error("Something went wrong.Please try again later","",{closeButton:true,timeOut:5000}).onHidden.subscribe(()=>{
          this.communicate.isLoaderLoad.next(false);
        });
      }
    });
  }

  getIndustryList(){
    this.communicate.isLoaderLoad.next(true);
    this.api.allPostMethod("industry/industrieslist",this.paginationData).subscribe((res:any)=>{
      if(res?.data.length > 0){
        console.log(res.data);
        if(this.paginationData.pageNumber == 1){
          this.industryList = res.data;
        }else{
          this.industryList.push(...res.data);
        }
          this.totalPage = res.totalPages;
        
      }else{
        this.industryList = [];
      }
      this.communicate.isLoaderLoad.next(false);
    });
  }

  onScroll(){
    if(this.paginationData.pageNumber < this.totalPage ){
      console.log("OnScroll");
      this.paginationData.pageNumber += 1;
      this.getIndustryList();
    }
  }
}
