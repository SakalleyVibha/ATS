import { Component } from '@angular/core';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { CommunicateService } from '../../core/services/communicate.service';
import { CommonApiService } from '../../core/services/common-api.service';
import { ToastrService } from 'ngx-toastr';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-permission',
  templateUrl: './permission.component.html',
  styleUrl: './permission.component.css'
})
export class PermissionComponent {
  permissionList: any = [];
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
    this.getPermissionList();
    this.changeSearchVal();
  }
  changeSearchVal() {
    this.searchKeyword.valueChanges
      .pipe(debounceTime(1000), distinctUntilChanged())
      .subscribe({
        next: (val:any) => {
          if (val == '' || val.trim().length > 2) {
            this.permissionList = [];
            this.payload.keyword = val;
            this.payload.pageNumber = 1;
            this.getPermissionList();
          }
        },
      });
  }
  getPermissionList() {
    this.communicate.isLoaderLoad.next(true);
    this.api.allPostMethod('permission/permissions',this.payload).subscribe({
      next: (res:any)=>{
        if(!res.error){
          this.communicate.isLoaderLoad.next(false);
           this.permissionList = [...this.permissionList,...res.data]
        }else{
          this.communicate.isLoaderLoad.next(false);
        }
      }
    })
  }
  onScroll() {
    this.payload.pageNumber += 1;
    this.getPermissionList()
  }
  deletePermission(id: number) {
    this.api.allPostMethod('permission/deletepermission',{ id }).subscribe({
      next: (res:any)=>{
        if(!res.error){
          this.payload.pageNumber = 1;
          this.payload.keyword = '';
          this.searchKeyword.reset();
          this.permissionList = [];
          this.getPermissionList()
          this.toastr.success(res.message,"",{closeButton:true,timeOut:5000}).onHidden.subscribe(()=>{
            this.communicate.isLoaderLoad.next(false);
          });
        }else{
          this.toastr.error(res.message,"",{closeButton:true,timeOut:5000}).onHidden.subscribe(()=>{
            this.communicate.isLoaderLoad.next(false);
          });
        }
      }
    })
  }
}
