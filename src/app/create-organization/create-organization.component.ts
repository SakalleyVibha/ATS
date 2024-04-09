import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CommonApiService } from '../core/services/common-api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-organization',
  templateUrl: './create-organization.component.html',
  styleUrl: './create-organization.component.css'
})
export class CreateOrganizationComponent {

  organizationForm:FormGroup;
  isFieldsValid:boolean = false;
  fileTypeBase64!: ArrayBuffer | any;
  logoName:string = '';

  constructor(private formBuild:FormBuilder,private router:Router,private toastr:ToastrService,private serviceApi:CommonApiService){
    this.organizationForm = this.formBuild.group({
      name: ['',[Validators.required, Validators.minLength(2), Validators.pattern(/^(?!(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|EXEC|ALTER|CREATE|TRUNCATE)|(['";\\])|(\b\d+\b)|(\/\*[\s\S]*?\*\/|--.*)|(AND|OR|NOT|XOR)|\b(?:SELECT|INSERT|UPDATE|DELETE|EXEC)\s*\(|(error|exception|warning))/i)]],
      about:['',[Validators.required, Validators.maxLength(150) ,Validators.pattern(/^(?!(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|EXEC|ALTER|CREATE|TRUNCATE)|(['";\\])|(\b\d+\b)|(\/\*[\s\S]*?\*\/|--.*)|(AND|OR|NOT|XOR)|\b(?:SELECT|INSERT|UPDATE|DELETE|EXEC)\s*\(|(error|exception|warning))/i)]],
      website: ['', [Validators.required, Validators.pattern('(^((http|https)://)|((www)[.]))[A-Za-z0-9_@./#!$%^:*&+-]+([\-\.]{1}[a-z0-9]+)*\.(?:com|net|in|org|io)$')]],
      phone: ['', [Validators.required, Validators.pattern('[6-9][0-9]{12}')]],
      mobile: ['', [Validators.required, Validators.pattern('[6-9][0-9]{12}')]],
      fax: ['', [Validators.required,Validators.pattern('^[0-9]*$'), Validators.minLength(10), Validators.maxLength(13)]],
      street:['',[Validators.required, Validators.pattern(/^(?!(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|EXEC|ALTER|CREATE|TRUNCATE)|(['";\\])|(\b\d+\b)|(\/\*[\s\S]*?\*\/|--.*)|(AND|OR|NOT|XOR)|\b(?:SELECT|INSERT|UPDATE|DELETE|EXEC)\s*\(|(error|exception|warning))/i)]],
      city:['',[Validators.required, Validators.pattern(/^(?!(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|EXEC|ALTER|CREATE|TRUNCATE)|(['";\\])|(\b\d+\b)|(\/\*[\s\S]*?\*\/|--.*)|(AND|OR|NOT|XOR)|\b(?:SELECT|INSERT|UPDATE|DELETE|EXEC)\s*\(|(error|exception|warning))/i)]],
      country:['',[Validators.required, Validators.pattern(/^(?!(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|EXEC|ALTER|CREATE|TRUNCATE)|(['";\\])|(\b\d+\b)|(\/\*[\s\S]*?\*\/|--.*)|(AND|OR|NOT|XOR)|\b(?:SELECT|INSERT|UPDATE|DELETE|EXEC)\s*\(|(error|exception|warning))/i)]],
      state:['',[Validators.required, Validators.pattern(/^(?!(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|EXEC|ALTER|CREATE|TRUNCATE)|(['";\\])|(\b\d+\b)|(\/\*[\s\S]*?\*\/|--.*)|(AND|OR|NOT|XOR)|\b(?:SELECT|INSERT|UPDATE|DELETE|EXEC)\s*\(|(error|exception|warning))/i)]],
      zip:['',[Validators.required,Validators.minLength(6), Validators.maxLength(6), Validators.pattern('^[0-9]*$')]],
      logo:['',[Validators.required]]
    });
  }

  get formData() { return this.organizationForm.controls }

  onSubmit(){
    if(this.organizationForm.invalid) {
      this.isFieldsValid = true;
      return
    }
    this.organizationForm.value.logo = this.fileTypeBase64;
    this.serviceApi.allPostMethod("accounts/account",this.organizationForm.value).subscribe((response:any)=>{
      let shareData:any = localStorage.getItem('Shared_Data');
      shareData = JSON.parse(shareData);
      shareData.account_id = response['data']?.id;
      localStorage.setItem("Shared_Data",JSON.stringify(shareData));
      if(response.message){
        this.toastr.success("Form Submitted","",{closeButton:true,timeOut:5000}).onHidden.subscribe(()=>{
          this.router.navigate(['/create-user-location']);
        });
      }else{
        this.toastr.error("Something went wrong","",{timeOut:5000,closeButton:true});
      }
    })
  }

  convertImageToBase64(file_event: any) {
    this.logoName = file_event?.target?.files[0]?.name
    const reader = new FileReader();
    reader.readAsDataURL(file_event.srcElement.files[0]);
    reader.onload = () => {
      this.fileTypeBase64 = reader.result
    };
  }
}
