import { Component, signal } from '@angular/core';
import { FormControl } from '@angular/forms';
import { CommonApiService } from '../../core/services/common-api.service';
import { CommunicateService } from '../../core/services/communicate.service';
import { Subject, debounceTime, distinctUntilChanged, filter } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-lob',
  templateUrl: './lob.component.html',
  styleUrl: './lob.component.css'
})
export class LobComponent {

  lobList = signal<Array<any>>([])
  current_role = signal<any>({});
  reqObj: any;
  totalPages: number = 0;
  searchByKey: FormControl = new FormControl('');
  searchValue = new Subject<Event>();
  searchString: string = ''

  constructor(private api: CommonApiService, private communicate: CommunicateService, private toastr: ToastrService) {
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
        this.getlobList();
      });
    this.getlobList();
  }

  getlobList() {
    this.communicate.isLoaderLoad.next(true);
    this.api.allPostMethod('lob/getLobList', this.reqObj).subscribe((res: any) => {
      this.communicate.isLoaderLoad.next(false);
      if (res['error'] != true) {
        if ((res['data'] && res['data'].length > 0)) {
          if (this.reqObj.pageNumber == 1) {
            this.lobList.set(res['data']);
          } else
            this.lobList.update(x => {
              return [...x, ...res['data']]
            })
          this.totalPages = res['totalPages'];
        } else {
          this.lobList.set([]);
        }
      }
    });
  }

  deleteTeam(id: number) {
    this.communicate.isLoaderLoad.next(true);
    this.api.allPostMethod('lob/deleteLob', { id: id, account_id: this.reqObj.account_id }).subscribe((res: any) => {
      if (res['error'] != true) {
        this.reqObj.pageNumber = 1;
        this.getlobList();
        this.communicate.isLoaderLoad.next(false);
        if (res.data && res.data > 0) {
          this.toastr.success("Teams deleted successfully", "")
        }
      } else {
        this.toastr.error(res['message'], "")
      }
    });
  }

  onScroll() {
    if (this.reqObj.pageNumber < this.totalPages) {
      this.reqObj.pageNumber += 1;
      this.getlobList();
    }
  }

  handleImageError(event: any) {
    event.target.src = 'images/default-avatar.jpg'; // Path to your fallback image
  }

}
