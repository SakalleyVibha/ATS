import { Component } from '@angular/core';
import { CommonApiService } from '../../../core/services/common-api.service';
import { FormBuilder,FormGroup,Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-manage-client',
  templateUrl: './manage-client.component.html',
  styleUrl: './manage-client.component.css'
})
export class ManageClientComponent {

  client_Form:FormGroup;
  isFieldsValid:boolean = false;
  location_list:any = [];
  fileTypeBase64!: ArrayBuffer | any;
  logoName:string = '';
  clientEdit:boolean = false;
  isFieldShow:boolean = false;

  constructor(private api:CommonApiService,private formbuilder:FormBuilder,private router:Router,private toastr:ToastrService,private activeRouter:ActivatedRoute){
    let shareData: any = localStorage.getItem("Shared_Data");
    shareData = JSON.parse(shareData);
    // this.client_Form.value.account_id = shareData.account_id;
    this.client_Form = this.formbuilder.group({
      name: ['',[Validators.required,Validators.minLength(2), Validators.pattern(/^(?!(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|EXEC|ALTER|CREATE|TRUNCATE)|(['";\\])|(\b\d+\b)|(\/\*[\s\S]*?\*\/|--.*)|(AND|OR|NOT|XOR)|\b(?:SELECT|INSERT|UPDATE|DELETE|EXEC)\s*\(|(error|exception|warning))/i)]],
      website: ['',[Validators.required, Validators.pattern('(^((http|https)://)|((www)[.]))[A-Za-z0-9_@./#!$%^:*&+-]+([\-\.]{1}[a-z0-9]+)*\.(?:com|net|in|org|io)$')]],
      logo:['',[Validators.required]],
      mobile: ['',[Validators.required, Validators.pattern('[6-9][0-9]{12}')]],
      phone: ['',[Validators.required, Validators.pattern('[6-9][0-9]{12}')]],
      fax: ['',[Validators.required,Validators.pattern('^[0-9]*$'), Validators.minLength(10), Validators.maxLength(13)]],
      about: ['',[Validators.required, Validators.maxLength(150), Validators.pattern(/^(?!(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|EXEC|ALTER|CREATE|TRUNCATE)|(['";\\])|(\b\d+\b)|(\/\*[\s\S]*?\*\/|--.*)|(AND|OR|NOT|XOR)|\b(?:SELECT|INSERT|UPDATE|DELETE|EXEC)\s*\(|(error|exception|warning))/i)]],

      poc_name: ['',[Validators.required, Validators.pattern(/^(?!(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|EXEC|ALTER|CREATE|TRUNCATE)|(['";\\])|(\b\d+\b)|(\/\*[\s\S]*?\*\/|--.*)|(AND|OR|NOT|XOR)|\b(?:SELECT|INSERT|UPDATE|DELETE|EXEC)\s*\(|(error|exception|warning))/i)]],
      poc_email: ['',[Validators.required,Validators.email]],
      poc_phone: ['',[Validators.required, Validators.pattern('[6-9][0-9]{12}')]],
      poc_mobile: ['',[Validators.required, Validators.pattern('[6-9][0-9]{12}')]],
      poc_fax: ['',[Validators.required,Validators.pattern('^[0-9]*$'), Validators.minLength(10), Validators.maxLength(13)]],

      street: ['',[Validators.required, Validators.pattern(/^(?!(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|EXEC|ALTER|CREATE|TRUNCATE)|(['";\\])|(\b\d+\b)|(\/\*[\s\S]*?\*\/|--.*)|(AND|OR|NOT|XOR)|\b(?:SELECT|INSERT|UPDATE|DELETE|EXEC)\s*\(|(error|exception|warning))/i)]],
      state: ['',[Validators.required, Validators.pattern(/^(?!(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|EXEC|ALTER|CREATE|TRUNCATE)|(['";\\])|(\b\d+\b)|(\/\*[\s\S]*?\*\/|--.*)|(AND|OR|NOT|XOR)|\b(?:SELECT|INSERT|UPDATE|DELETE|EXEC)\s*\(|(error|exception|warning))/i)]],
      city: ['',[Validators.required, Validators.pattern(/^(?!(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|EXEC|ALTER|CREATE|TRUNCATE)|(['";\\])|(\b\d+\b)|(\/\*[\s\S]*?\*\/|--.*)|(AND|OR|NOT|XOR)|\b(?:SELECT|INSERT|UPDATE|DELETE|EXEC)\s*\(|(error|exception|warning))/i)]],
      zip: ['',[Validators.required,Validators.minLength(6), Validators.maxLength(6), Validators.pattern('^[0-9]*$')]],
      country: ['',[Validators.required, Validators.pattern(/^(?!(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|EXEC|ALTER|CREATE|TRUNCATE)|(['";\\])|(\b\d+\b)|(\/\*[\s\S]*?\*\/|--.*)|(AND|OR|NOT|XOR)|\b(?:SELECT|INSERT|UPDATE|DELETE|EXEC)\s*\(|(error|exception|warning))/i)]],

      location_id: [''],
      account_id:Number(shareData.account_id)
    });
    this.getLocationList(shareData.account_id);
    this.activeRouter.queryParams.subscribe((isClientId:any)=>{
      if(isClientId.id != null || isClientId.id != undefined ){
        this.clientEdit = true
      }
    });
  }

  get formData() { return this.client_Form.controls }

  ngOnInit(){}

  getLocationList(acc_id:number){
    this.api.allPostMethod('locations/locationlist', { account_id: acc_id, pageNumber: 1, pageSize: 10 }).subscribe((res: any) => {
      if (res['data']) {
        this.location_list = res['data'];
        this.client_Form.controls['location_id']?.setValidators([Validators.required]);
        this.client_Form.controls['location_id'].updateValueAndValidity();
      }
    });
  }

  onSubmit(){
    this.client_Form.value.logo = this.fileTypeBase64;

    if(this.client_Form.invalid){
      this.isFieldsValid = true;
      return
    }

    this.client_Form.patchValue({
      location_id: Number(this.client_Form.value.location_id),
    })
    
    this.api.allPostMethod("clients/client",this.client_Form.value).subscribe((afterAdd:any)=>{
      console.log(afterAdd);
      if(afterAdd.message){
        this.toastr.success("Client created successfully","",{closeButton:true,timeOut:5000}).onHidden.subscribe(()=>{
          this.router.navigate(['/dashboard-detail/client-detail']);
        })
      }else{
        this.toastr.error("Something went wrong, Try again later","",{closeButton:true,timeOut:5000});
      }
    })
  }

  onEditClient(){
    
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
