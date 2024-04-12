import { Component } from '@angular/core';
import { CommonApiService } from '../../core/services/common-api.service';
import { CommunicateService } from '../../core/services/communicate.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-industry',
  templateUrl: './industry.component.html',
  styleUrl: './industry.component.css'
})
export class IndustryComponent {
  industryList:any;
  account_id:any;
  constructor(private api:CommonApiService,private communicate:CommunicateService,private toastr:ToastrService){}

  ngOnInit(){
    let shareData: any = localStorage.getItem("Shared_Data");
    shareData = JSON.parse(shareData);
    this.account_id = shareData.account_id;
    this.getIndustryList();
  }

  onDeleteIndustry(id:number){
    this.communicate.isLoaderLoad.next(true);
    this.api.allPostMethod("industry/deleteindustries",{id:id,account_id:this.account_id}).subscribe((res:any)=>{
      if(res && res?.message){
        this.communicate.isLoaderLoad.next(false);        
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
    this.industryList = undefined;
    this.api.allPostMethod("industry/industrieslist",{account_id:this.account_id,pageNumber:1,pageSize:10}).subscribe((res:any)=>{
      if(res?.data.length > 0){
        this.industryList = res.data;
      }else{
        this.industryList = [];
      }
      this.communicate.isLoaderLoad.next(false);
    });
  }
}
