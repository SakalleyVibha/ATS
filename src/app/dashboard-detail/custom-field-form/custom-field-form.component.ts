import { Component, signal } from '@angular/core';
import { CommonApiService } from '../../core/services/common-api.service';
import { CommunicateService } from '../../core/services/communicate.service';
import { ToastrService } from 'ngx-toastr';
import { FormControl } from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged, filter } from 'rxjs';


@Component({
  selector: 'app-custom-field-form',
  templateUrl: './custom-field-form.component.html',
  styleUrl: './custom-field-form.component.css'
})
export class CustomFieldFormComponent {

  customFieldList = signal<Array<any>>([])
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
        this.getCustomFieldList();
      });
    this.getCustomFieldList();
  }

  getCustomFieldList() {
    this.communicate.isLoaderLoad.next(true);
    this.api.allPostMethod('custome-field/getList', this.reqObj).subscribe((res: any) => {
      this.communicate.isLoaderLoad.next(false);
      if (res['error'] != true) {
        if ((res['data'] && res['data'].length > 0)) {
          if (this.reqObj.pageNumber == 1) {
            this.customFieldList.set(res['data']);
          } else
            this.customFieldList.update(x => {
              return [...x, ...res['data']]
            })
          this.totalPages = res['totalPages'];
        } else {
          this.customFieldList.set([]);
        }
      }
    });
  }

  onScroll() {
    if (this.reqObj.pageNumber < this.totalPages) {
      this.reqObj.pageNumber += 1;
      this.getCustomFieldList();
    }
  }


}
