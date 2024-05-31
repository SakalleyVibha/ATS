import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { CommonApiService } from '../../core/services/common-api.service';
import { CommunicateService } from '../../core/services/communicate.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-modules',
  templateUrl: './modules.component.html',
  styleUrl: './modules.component.css',
})
export class ModulesComponent {
  moduleList: any = [];
  searchKeyword: FormControl = new FormControl();
  payload = {
    pageNumber: 1,
    pageSize: 10,
    keyword: '',
  };

  constructor(
    private api: CommonApiService,
    private communicate: CommunicateService,
    private toastr: ToastrService
  ){}
  ngOnInit(): void {
    this.getModuleList();
    this.changeSearchVal();
  }
  changeSearchVal() {
    this.searchKeyword.valueChanges
      .pipe(debounceTime(1000), distinctUntilChanged())
      .subscribe({
        next: (val) => {
          if (val == '' || val.trim().length > 2) {
            this.moduleList = [];
            this.payload.keyword = val;
            this.payload.pageNumber = 1;
            this.getModuleList();
          }
        },
      });
  }
  getModuleList() {
    this.communicate.isLoaderLoad.next(true);
    this.api.allPostMethod('module/getmodules',this.payload).subscribe({
      next: (res:any)=>{
         if(!res.error){
          this.communicate.isLoaderLoad.next(false);
            this.moduleList = [...this.moduleList, ...res.data];
         }else{
          this.toastr.error(res.message || res.error,"",{closeButton:true,timeOut:5000}).onHidden.subscribe(()=>{
            this.communicate.isLoaderLoad.next(false);
          });
         }
      }
    })
  }
  onScroll() {
    this.payload.pageNumber += 1;
    this.getModuleList()
  }
  deleteModule(id: number) {
    this.communicate.isLoaderLoad.next(true);
    this.api.allPostMethod('module/deletemodule',{ id }).subscribe({
      next: (res:any)=>{
         if(!res.error){
          this.payload.keyword = '';
          this.payload.pageNumber = 1;
          this.searchKeyword.reset();
          this.moduleList = [];
          this.getModuleList()
          this.toastr.success(res.message,"",{closeButton:true,timeOut:1000}).onHidden.subscribe(()=>{
            this.communicate.isLoaderLoad.next(false);
          });
         }else{
          this.toastr.error(res.message || res.error,"",{closeButton:true,timeOut:5000}).onHidden.subscribe(()=>{
            this.communicate.isLoaderLoad.next(false);
          });
         }
      }
    })
  }
}
