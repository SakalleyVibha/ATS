import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CommonApiService } from '../../../core/services/common-api.service';
import { CommunicateService } from '../../../core/services/communicate.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { IDropdownSettings } from 'ng-multiselect-dropdown';

@Component({
  selector: 'app-manage-section',
  templateUrl: './manage-section.component.html',
  styleUrl: './manage-section.component.css'
})
export class ManageSectionComponent {
  sectionForm!:FormGroup;
  isEditForm = false;
  isFormValid = false;
  sectionId:any;
  moduleList:any = []
  dropdownSettings:IDropdownSettings = {
    singleSelection: true,
    idField: 'id',
    textField: 'module_name',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 3,
    maxHeight:100,
    allowSearchFilter: true
  };
  constructor(
    private fb: FormBuilder,
    private api: CommonApiService,
    private communicate: CommunicateService,
    private activeRoute: ActivatedRoute,
    private toastr: ToastrService,
    private router: Router
  ){
    this.getModuleList()
     this.sectionForm = this.fb.group({
       name: new FormControl('',[Validators.required,Validators.minLength(2),Validators.pattern(communicate.queryValidator)]),
       description: new FormControl('',[Validators.required,Validators.maxLength(150),Validators.pattern(communicate.queryValidator)]),         
       module_id: new FormControl('',[Validators.required]),         
       status: new FormControl(true)
     })
  }

  ngOnInit():void{
     this.activeRoute.queryParamMap.subscribe({
      next: (params)=>{
          this.sectionId = Number(params.get('id'));
          if(this.sectionId){
            this.isEditForm = true;
            this.getSectionDetails(this.sectionId)
          }
      }
     })
  }
  get formData(){ return this.sectionForm.controls}
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
  getSectionDetails(id:number){
    this.communicate.isLoaderLoad.next(true)
    this.api.allPostMethod('section/getsection',{ id }).subscribe({
      next: (res:any)=>{
        if(!res.error){
          this.communicate.isLoaderLoad.next(false);
           let section = res.data;
           this.sectionForm.patchValue({
            name: section.section_name,
            description: section.section_description,
            module_id: section.module_id,
            status: section.status
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
    if(!this.sectionForm.valid){
      this.isFormValid = true;
      return;
    } 
    this.communicate.isLoaderLoad.next(true);
    let formVal = this.sectionForm.value;
    let payload = {
      section_name: formVal.name,
      section_description: formVal.description,
      module_id: formVal.module_id
    }
    this.api.allPostMethod('section/addsection',payload).subscribe({
      next: (res:any)=>{
        if(!res.error){
          this.toastr.success(res.message,"",{closeButton:true,timeOut:1000}).onHidden.subscribe(()=>{
            this.communicate.isLoaderLoad.next(false);
            this.router.navigate(['super-admin/section'])
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
    if(!this.sectionForm.valid){
      this.isFormValid = true;
      return;
    } 
    this.communicate.isLoaderLoad.next(true);
    let formVal = this.sectionForm.value;
    let payload = {
      id: this.sectionId,
      section_name: formVal.name,
      section_description: formVal.description,
      module_id: formVal.module_id
    }
    this.api.allPostMethod('section/editsection',payload).subscribe({
      next: (res:any)=>{
        if(!res.error){
          this.toastr.success(res.message,"",{closeButton:true,timeOut:1000}).onHidden.subscribe(()=>{
            this.communicate.isLoaderLoad.next(false);
            this.router.navigate(['super-admin/section'])
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
