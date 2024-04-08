import { Component } from '@angular/core';
import { FormBuilder,FormGroup,Validators } from '@angular/forms';
import { CommonApiService } from '../../../core/services/common-api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-manage-location',
  templateUrl: './manage-location.component.html',
  styleUrl: './manage-location.component.css'
})
export class ManageLocationComponent {

  addLocationForm:FormGroup;
  isFormValid:boolean = false;
  editLocation:boolean = false;

  constructor(private api:CommonApiService,private formBuilder:FormBuilder,private router:Router,private activatedRoute: ActivatedRoute,private toastr:ToastrService){
    this.addLocationForm = this.formBuilder.group({
    name: ['',[Validators.required,Validators.minLength(2), Validators.pattern(/^(?!(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|EXEC|ALTER|CREATE|TRUNCATE)|(['";\\])|(\b\d+\b)|(\/\*[\s\S]*?\*\/|--.*)|(AND|OR|NOT|XOR)|\b(?:SELECT|INSERT|UPDATE|DELETE|EXEC)\s*\(|(error|exception|warning))/i)]],
    about:['',[Validators.required,Validators.maxLength(150), Validators.pattern(/^(?!(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|EXEC|ALTER|CREATE|TRUNCATE)|(['";\\])|(\b\d+\b)|(\/\*[\s\S]*?\*\/|--.*)|(AND|OR|NOT|XOR)|\b(?:SELECT|INSERT|UPDATE|DELETE|EXEC)\s*\(|(error|exception|warning))/i)]],
    account_id: '',
    website:['',[Validators.required,Validators.pattern('(^((http|https)://)|((www)[.]))[A-Za-z0-9_@./#!$%^:*&+-]+([\-\.]{1}[a-z0-9]+)*\.(?:com|net|in|org|io)$')]],
    phone:['',[Validators.required,, Validators.pattern('[6-9][0-9]{12}')]],
    mobile:['',[Validators.required, Validators.pattern('[6-9][0-9]{12}')]],
    fax:['',[Validators.required,Validators.required,Validators.pattern('^[0-9]*$'), Validators.minLength(10), Validators.maxLength(13)]],
    street:['',[Validators.required, Validators.pattern(/^(?!(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|EXEC|ALTER|CREATE|TRUNCATE)|(['";\\])|(\b\d+\b)|(\/\*[\s\S]*?\*\/|--.*)|(AND|OR|NOT|XOR)|\b(?:SELECT|INSERT|UPDATE|DELETE|EXEC)\s*\(|(error|exception|warning))/i)]],
    city:['',[Validators.required, Validators.pattern(/^(?!(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|EXEC|ALTER|CREATE|TRUNCATE)|(['";\\])|(\b\d+\b)|(\/\*[\s\S]*?\*\/|--.*)|(AND|OR|NOT|XOR)|\b(?:SELECT|INSERT|UPDATE|DELETE|EXEC)\s*\(|(error|exception|warning))/i)]],
    country:['',[Validators.required, Validators.pattern(/^(?!(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|EXEC|ALTER|CREATE|TRUNCATE)|(['";\\])|(\b\d+\b)|(\/\*[\s\S]*?\*\/|--.*)|(AND|OR|NOT|XOR)|\b(?:SELECT|INSERT|UPDATE|DELETE|EXEC)\s*\(|(error|exception|warning))/i)]],
    state:['',[Validators.required, Validators.pattern(/^(?!(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|EXEC|ALTER|CREATE|TRUNCATE)|(['";\\])|(\b\d+\b)|(\/\*[\s\S]*?\*\/|--.*)|(AND|OR|NOT|XOR)|\b(?:SELECT|INSERT|UPDATE|DELETE|EXEC)\s*\(|(error|exception|warning))/i)]],
    zip:['',[Validators.required,Validators.minLength(6), Validators.maxLength(6), Validators.pattern('^[0-9]*$')]],
    logo:['',[Validators.required]]
    });

  }

  ngOnInit(){
    let id :number;
    let localData: any = localStorage.getItem('Shared_Data');
    localData = JSON.parse(localData);
    this.addLocationForm.patchValue({
      account_id: localData.account_id
    });
    this.activatedRoute.queryParams.subscribe((paramMap:any) => { 
      id = paramMap.id;
      if(id != null && id != undefined){
        this.editLocation = true;
      }
    });

  }

  get formData() { return this.addLocationForm.controls }

  onSubmit(){
    if(this.addLocationForm.invalid){
      this.isFormValid = true;
      return;
    }

    this.api.allPostMethod("locations/location",this.addLocationForm.value).subscribe((resp_location:any)=>{
      console.log("After add location : ",resp_location);
      if(resp_location.message){
        this.toastr.success("Location added succesfully","",{closeButton:true,timeOut:5000}).onHidden.subscribe(()=>{
          this.router.navigate(['/create-user-location/location-detail']);
        });
      }else{
        this.toastr.error("Something went wrong, Please try again later","",{closeButton:true,timeOut:5000});
      }
    });
  }

  onEditForm(){

  }
}
