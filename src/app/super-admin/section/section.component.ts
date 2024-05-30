import { Component } from '@angular/core';
import { CommonApiService } from '../../core/services/common-api.service';
import { CommunicateService } from '../../core/services/communicate.service';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-section',
  templateUrl: './section.component.html',
  styleUrl: './section.component.css'
})
export class SectionComponent {
   sectionList:any[] = [];
   searchKeyword:FormControl = new FormControl('');
   payload = {
    pageNumber: 1,
    pageSize: 10,
    keyword: ''
 }

  constructor(
    private api: CommonApiService,
    private communicate: CommunicateService,
    private toastr: ToastrService
  ){}
  ngOnInit():void{
    this.getSectionList();
    this.changeSearchVal()
  }
  changeSearchVal(){
     this.searchKeyword.valueChanges
     .pipe(
       debounceTime(1000),
       distinctUntilChanged()
     )
     .subscribe({
      next: (val)=>{
        if(val == '' || val.trim().length > 2){
            this.sectionList = [];
            this.payload.keyword = val;
            this.payload.pageNumber = 1;
            this.getSectionList()
        }
      }
     })
  }
   getSectionList(){
     this.communicate.isLoaderLoad.next(true);
    this.api.allPostMethod('section/sections',this.payload).subscribe({
      next: (res:any)=>{
         if(!res.error){
          this.communicate.isLoaderLoad.next(false);
             this.sectionList = [...this.sectionList,...res.data]
         }else{
           console.log(res.message || res.error)
         }
      }
    })
   }
   deleteSection(id:number){
    this.communicate.isLoaderLoad.next(true);
    this.api.allPostMethod("section/deletesection",{ id }).subscribe({
      next: (res:any)=>{
        if(!res.error){
          this.payload.pageNumber = 1;
          this.payload.keyword = '';
          this.searchKeyword.reset();
          this.sectionList = [];
          this.getSectionList()
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

   onScroll(){
       this.payload.pageNumber += 1;
       this.getSectionList();
   }
}
