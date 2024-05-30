import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CommonApiService } from '../../../core/services/common-api.service';
import { CommunicateService } from '../../../core/services/communicate.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-manage-module',
  templateUrl: './manage-module.component.html',
  styleUrl: './manage-module.component.css'
})
export class ManageModuleComponent {
  moduleForm!: FormGroup;
  isEditForm = false;
  isFormValid = false;
  moduleId:any

  constructor(
    private api: CommonApiService,
    private communicate: CommunicateService,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private activeRoute: ActivatedRoute,
    private router: Router
  ){
    
    this.moduleForm = this.fb.group({
      name: new FormControl('',[Validators.required,Validators.minLength(2),Validators.pattern(communicate.queryValidator)]),
      description: new FormControl('',[Validators.required,Validators.maxLength(150),Validators.pattern(communicate.queryValidator)]),         
    });
   
  }
  get formData(){ return this.moduleForm.controls}

  ngOnInit():void{
    this.activeRoute.queryParamMap.subscribe({
     next: (params)=>{
         this.moduleId = Number(params.get('id'));
         if(this.moduleId){
           this.isEditForm = true;
           this.getModuleDetails(this.moduleId)
         }
     }
    })
 }
  getModuleDetails(id:number){
    this.communicate.isLoaderLoad.next(true);
    this.api.allPostMethod('module/getmodule',{ id }).subscribe({
      next: (res:any)=>{
        if(!res.error){
          this.communicate.isLoaderLoad.next(false);
          let details = res.data;
          this.moduleForm.patchValue({
            name: details.module_name,
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
    if(!this.moduleForm.valid){
      this.isFormValid = true;
      return;
    } 
    this.communicate.isLoaderLoad.next(true);
    let formVal = this.moduleForm.value;
    let payload = {
      module_name: formVal.name,
    }
    this.api.allPostMethod('module/addmodule',payload).subscribe({
      next: (res:any)=>{
        if(!res.error){
          this.toastr.success(res.message,"",{closeButton:true,timeOut:5000}).onHidden.subscribe(()=>{
            this.communicate.isLoaderLoad.next(false);
            this.router.navigate(['super-admin/modules'])
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
    if(!this.moduleForm.valid){
      this.isFormValid = true;
      return;
    } 
    this.communicate.isLoaderLoad.next(true);
    let formVal = this.moduleForm.value;
    let payload = {
      id: this.moduleId,
      module_name: formVal.name,
    }
    this.api.allPostMethod('module/editmodule',payload).subscribe({
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
