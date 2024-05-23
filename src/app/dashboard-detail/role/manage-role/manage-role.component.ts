import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CommonApiService } from '../../../core/services/common-api.service';
import { CommunicateService } from '../../../core/services/communicate.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { IDropdownSettings } from 'ng-multiselect-dropdown';

@Component({
  selector: 'app-manage-role',
  templateUrl: './manage-role.component.html',
  styleUrl: './manage-role.component.css'
})
export class ManageRoleComponent {
  roleForm:FormGroup;
  isFormValid:boolean = false;
  isEditForm:boolean = false;
  isActive:boolean = true;
  roleId:any;
  sectionList = [];
  dropdownSettings:IDropdownSettings = {
    singleSelection: false,
    idField: 'id',
    textField: 'section_name',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 3,
    maxHeight:100,
    allowSearchFilter: true
  };
  
  constructor(private api:CommonApiService,private router:Router,private communicate:CommunicateService,private formBuild:FormBuilder,private toastr:ToastrService,private activeRouter:ActivatedRoute){
    let user_data: any = localStorage.getItem('Shared_Data');
    user_data = JSON.parse(user_data);

    this.roleForm = this.formBuild.group({
      name: new FormControl('',[Validators.required,Validators.minLength(2),Validators.pattern(communicate.queryValidator)]),
      description: new FormControl('',[Validators.required,Validators.maxLength(150),Validators.pattern(communicate.queryValidator)]),
      section: new FormControl([]),
      status: new FormControl(true)
    });
    this.communicate.isLoaderLoad.next(true);
    this.getSectionList()
   
  }
  get formData() { return this.roleForm.controls };

  ngOnInit():void{
     this.activeRouter.queryParamMap.subscribe(params => {
        this.roleId = params.get('id');
        if( this.roleId){
           this.isEditForm = true;
           this.communicate.isLoaderLoad.next(true);
           this.getRoleDetails(Number( this.roleId));
        }
     })
  }
  
  getSectionList(){
    let payload = {
       pageNumber: 1,
       pageSize: 100,
       keyword: ''
    }
    this.api.allPostMethod('section/sections',payload).subscribe({
      next: (res:any)=>{
        this.communicate.isLoaderLoad.next(false);
         if(!res.error){
           this.sectionList = res.data;
         }
      }
    })
  }

  getRoleDetails(id:number){
      this.api.allPostMethod('role/getrole',{ id }).subscribe({
        next: (res:any)=>{
            if(!res.error){
              this.communicate.isLoaderLoad.next(false); 
              let sections = res.data.role_section_relations.map((v:any) => v.section_master);
              this.roleForm.patchValue({
                name: res.data?.role_name,
                description: res.data?.role_description,
                section: sections,
               // status: res.data?.status
              })
            }else{
              this.toastr.error(res.message,"",{closeButton:true,timeOut:5000}).onHidden.subscribe(()=>{
                this.communicate.isLoaderLoad.next(false);
              });
            }
        }
      })
  }

  onSubmitForm(){
    if(this.roleForm.invalid){
      this.isFormValid = true;
      return;
    };
    let formVal = this.roleForm.value;
    let payload = {
      role_name: formVal.name,
      role_description: formVal.description,
      section_ids: formVal.section.map((v:any)=> v.id)
    }
    this.communicate.isLoaderLoad.next(true);
    this.api.allPostMethod('role/addrole',payload).subscribe({
      next: (res:any)=>{
          if(!res.error){
            this.toastr.success(res.message,"",{closeButton:true,timeOut:5000}).onHidden.subscribe(()=>{
              this.communicate.isLoaderLoad.next(false);
              this.router.navigate(['dashboard-detail','role'])
            });
          }else{
            this.toastr.error(res.message || res.error,"",{closeButton:true,timeOut:5000}).onHidden.subscribe(()=>{
              this.communicate.isLoaderLoad.next(false);
            });
          }
      }
    })
  }

  onEditForm(){
    if(this.roleForm.invalid){
      this.isFormValid = true
      return
    }
    let formVal = this.roleForm.value
    let payload = {
      id: this.roleId,
      role_name: formVal.name,
      role_description: formVal.description,
      section_ids: formVal.section.map((v:any) => v.id),
    }
    this.communicate.isLoaderLoad.next(true);
    this.api.allPostMethod('role/editrole',payload).subscribe({
      next: (res:any)=>{
          if(!res.error){
            this.toastr.success(res.message,"",{closeButton:true,timeOut:5000}).onHidden.subscribe(()=>{
              this.communicate.isLoaderLoad.next(false);
              this.router.navigate(['dashboard-detail','role'])
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
