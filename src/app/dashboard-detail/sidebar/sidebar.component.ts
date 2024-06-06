import { Component } from '@angular/core';
import { CommonApiService } from '../../core/services/common-api.service';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { CommunicateService } from '../../core/services/communicate.service';
import { PERMISSIONS } from '../../core/Constants/permissions.constant';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {

  user_list: any;
  location_list: any;
  isDetailSide:boolean = true;
  permission = {
    candidate: true
  }

  constructor(private api: CommonApiService, private router: Router,private communicate: CommunicateService) {
    this.communicate.isDetailSideShow.subscribe(res =>{
       this.isDetailSide = res;
    })
    let user_data: any = localStorage.getItem('Shared_Data');
    user_data = JSON.parse(user_data);
    let isSkip:any = localStorage.getItem('isDashboardDetail');
    if(!user_data.is_owner){
      this.checkPermission();
    }
    if(!JSON.parse(isSkip)){
      this.getUserandLocation(user_data?.account_id);
    }
  }

  ngOnInit() { 
   }
  getUserandLocation(acc_id: number){
    let payLoad = { account_id: acc_id, pageNumber: 1, pageSize: 10 };
    forkJoin( {
      user : this.api.allPostMethod("users/getUserList", payLoad),
      location: this.api.allPostMethod('locations/locationlist',payLoad)
    }).subscribe({
      next: (res:any)=>{
        this.user_list = res.user?.data || [];
        this.user_list = this.user_list.filter((v:any)=> !v.is_owner);
        this.location_list = res.location?.data || [];
        let flag = !!(this.location_list.length && this.user_list.length);
        localStorage.setItem('isDashboardDetail',JSON.stringify(flag));
        this.communicate.isDetailSideShow.next(flag);
         if(!this.location_list.length){
          this.router.navigate(['dashboard-detail','location-detail']);
          return;
        }
        if(this.location_list.length &&  !this.user_list.length){
          this.router.navigate(['dashboard-detail','user-detail']);
         }
      }
    })

  }

  onLogout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
  skip() {
    this.communicate.isDetailSideShow.next(true);
    localStorage.setItem('isDashboardDetail',JSON.stringify(true));
    this.router.navigate(['dashboard-detail']);
  }
  checkPermission(){
      let permissiontoken = localStorage.getItem('permissiontoken');
      permissiontoken = this.communicate.decryptText(permissiontoken);
      this.permission['candidate'] = permissiontoken? permissiontoken.includes(PERMISSIONS.View_Candidate): false;
  }

}
