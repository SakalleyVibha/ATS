import { Component, signal } from '@angular/core';
import { CommonApiService } from '../../core/services/common-api.service';
import { ToastrService } from 'ngx-toastr';
import { CommunicateService } from '../../core/services/communicate.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-skills',
  templateUrl: './skills.component.html',
  styleUrl: './skills.component.css'
})
export class SkillsComponent {
  skill_List = signal<any>([]);
  reqObj = {};

  constructor(private api:CommonApiService,private toastr:ToastrService,private communicate:CommunicateService,private activeroute:ActivatedRoute){
    let user_data: any = localStorage.getItem('Shared_Data');
    user_data = JSON.parse(user_data);
    this.reqObj = {
      pageNumber: 1,
      pageSize: 10,
      id:user_data?.account_id
    }
  }

  ngOnInit(){
    this.api.allPostMethod("skill/skilllist",this.reqObj).subscribe((res)=>{
      console.log(res);
    })
  }
}
