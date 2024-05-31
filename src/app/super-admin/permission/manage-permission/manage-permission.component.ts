import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CommonApiService } from '../../../core/services/common-api.service';
import { CommunicateService } from '../../../core/services/communicate.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-manage-permission',
  templateUrl: './manage-permission.component.html',
  styleUrl: './manage-permission.component.css'
})
export class ManagePermissionComponent {
  permissionForm!:FormGroup;
  isEditForm = false;
  isFormValid = false;
  permissionId:any;
  moduleList:any = [];
  sectionList:any = [];
  constructor(
    private api: CommonApiService,
    private communicate: CommunicateService,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private activeRoute: ActivatedRoute,
    private router: Router,
    public location: Location
  ){
    this.getModuleList();
    this.permissionForm = this.fb.group({
      name: new FormControl('',[Validators.required,Validators.minLength(2),Validators.pattern(communicate.queryValidator)]),
      description: new FormControl('',[Validators.required,Validators.maxLength(150),Validators.pattern(communicate.queryValidator)]),         
      module_id: new FormControl('',[Validators.required]),         
      section_id: new FormControl('',[Validators.required]),         
    });

    this.valueChanges();
   
  }
  ngOnInit():void{
    this.activeRoute.queryParamMap.subscribe({
     next: (params)=>{
         this.permissionId = Number(params.get('id'));
         if(this.permissionId){
           this.isEditForm = true;
           this.getPermissionDetails(this.permissionId)
         }
     }
    })
 }
  get formData(){ return this.permissionForm.controls }
  valueChanges(){
    this.permissionForm.get('module_id')?.valueChanges.subscribe(value =>{
      this.getSectionList(Number(value));
    })
  }
  getSectionList(module_id: number){
    //this.communicate.isLoaderLoad.next(true);
    let payload = {
      pageNumber: 1,
      pageSize: 100,
      module_id
    }
   this.api.allPostMethod('section/sections',payload).subscribe({
     next: (res:any)=>{
        if(!res.error){
         this.communicate.isLoaderLoad.next(false);
            this.sectionList =  res.data;
        }else{
          console.log('error',res.message || res.error)
        }
     }
   })
  }
  getModuleList() {
    this.communicate.isLoaderLoad.next(true);
    let payload = {
      pageNumber: 1,
      pageSize: 100
    }
    this.api.allPostMethod('module/getmodules',payload).subscribe({
      next: (res:any)=>{
         if(!res.error){
          this.communicate.isLoaderLoad.next(false);
            this.moduleList = res.data;
         }else{
          this.toastr.error(res.message || res.error,"",{closeButton:true,timeOut:5000}).onHidden.subscribe(()=>{
            this.communicate.isLoaderLoad.next(false);
          });
         }
      }
    })
  }
  getPermissionDetails(id:number){
    this.communicate.isLoaderLoad.next(true);
    this.api.allPostMethod('permission/getpermission',{ id }).subscribe({
      next: (res:any)=>{
        if(!res.error){
          this.communicate.isLoaderLoad.next(false);
          let details = res.data;
          this.permissionForm.patchValue({
            name: details.permission_name,
            description: details.permission_description,
            module_id: details.module_id,
            section_id: details.section_id
          })
         }else{
          this.toastr.error(res.message || res.error,"",{closeButton:true,timeOut:5000}).onHidden.subscribe(()=>{
            this.communicate.isLoaderLoad.next(false);
          });
         }
      }
    })
  }
  onSubmitForm(){
    if(!this.permissionForm.valid){
      this.isFormValid = true;
      return;
    } 
    this.communicate.isLoaderLoad.next(true);
    let formVal = this.permissionForm.value;
    let payload = {
      permission_name: formVal.name,
      permission_description: formVal.description,
      module_id: formVal.module_id,
      section_id: formVal.section_id
    }
    this.api.allPostMethod('permission/addpermission',payload).subscribe({
      next: (res:any)=>{
        if(!res.error){
          this.toastr.success(res.message,"",{closeButton:true,timeOut:5000}).onHidden.subscribe(()=>{
            this.communicate.isLoaderLoad.next(false);
            this.router.navigate(['super-admin/permission'])
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
    if(!this.permissionForm.valid){
      this.isFormValid = true;
      return;
    } 
    this.communicate.isLoaderLoad.next(true);
    let formVal = this.permissionForm.value;
    let payload = {
      id: this.permissionId,
      permission_name: formVal.name,
      permission_description: formVal.description,
      module_id: formVal.module_id,
      section_id: formVal.section_id
    }
    this.api.allPostMethod('permission/editpermission',payload).subscribe({
      next: (res:any)=>{
        if(!res.error){
          this.toastr.success(res.message,"",{closeButton:true,timeOut:5000}).onHidden.subscribe(()=>{
            this.communicate.isLoaderLoad.next(false);
            this.router.navigate(['super-admin/permission'])
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
