import { Component, signal } from '@angular/core';
import { CommonApiService } from '../../core/services/common-api.service';
import { CommunicateService } from '../../core/services/communicate.service';
import { ToastrService } from 'ngx-toastr';
import { FormControl } from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged, filter } from 'rxjs';

@Component({
  selector: 'app-employment-type-form',
  templateUrl: './employment-type-form.component.html',
  styleUrl: './employment-type-form.component.css'
})
export class EmploymentTypeFormComponent {

  employmentTypeList = signal<Array<any>>([])
  current_role = signal<any>({});
  reqObj: any;
  totalPages: number = 0;
  searchByKey: FormControl = new FormControl('');
  searchValue = new Subject<Event>();
  searchString: string = ''


  constructor(private api: CommonApiService, private communicate: CommunicateService, private toastr: ToastrService){
    this.current_role.set(localStorage.getItem('role'));
    this.current_role.set(JSON.parse(this.current_role()));
    let user_data: any = localStorage.getItem('Shared_Data');
    user_data = JSON.parse(user_data);
    this.reqObj = {
      account_id: user_data?.account_id,
      pageNumber: 1,
      pageSize: 10,
      keyword: ''
    };

  }

  ngOnInit() {
    this.searchValue.pipe(filter((value: any) => value.length >= 3 || value == ''), debounceTime(1000), distinctUntilChanged()).subscribe(
      (value: any) => {
        this.reqObj.keyword = value;
        this.reqObj.pageNumber = 1;
        this.getEmploymentTypeList();
      });
    this.getEmploymentTypeList();
  }

  getEmploymentTypeList() {
    this.communicate.isLoaderLoad.next(true);
    this.api.allPostMethod('employement-type/employment-type-list', this.reqObj).subscribe((res: any) => {
      this.communicate.isLoaderLoad.next(false);
      if (res['error'] != true) {
        if ((res['data'] && res['data'].length > 0)) {
          if (this.reqObj.pageNumber == 1) {
            this.employmentTypeList.set(res['data']);
          } else
            this.employmentTypeList.update(x => {
              return [...x, ...res['data']]
            })
          this.totalPages = res['totalPages'];
        } else {
          this.employmentTypeList.set([]);
        }
      }
    });
  }
  deleteEmployment(id:number){
    this.communicate.isLoaderLoad.next(true);
      this.api.allPostMethod('employement-type/delete-employment-type',{ id }).subscribe({
        next: (res:any)=>{
           if(!res.error){
              this.getEmploymentTypeList();
              this.reqObj.keyword = '';
              this.searchByKey.reset()
              this.toastr.success(res.message,'');
              this.communicate.isLoaderLoad.next(false);
           }else{
            this.toastr.error(res.message || res.error, '');
            this.communicate.isLoaderLoad.next(false);
           }
        }
      })
  }
  onScroll() {
    if (this.reqObj.pageNumber < this.totalPages) {
      this.reqObj.pageNumber += 1;
      this.getEmploymentTypeList();
    }
  }

}
