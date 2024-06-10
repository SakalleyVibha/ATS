import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonApiService } from '../../../core/services/common-api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommunicateService } from '../../../core/services/communicate.service';
@Component({
  selector: 'app-manage-location',
  templateUrl: './manage-location.component.html',
  styleUrl: './manage-location.component.css'
})
export class ManageLocationComponent {

  addLocationForm: FormGroup;
  isFormValid: boolean = false;
  editLocation: boolean = false;
  logoName: string = '';
  imgURLBase64!: ArrayBuffer | any;

  constructor(private api: CommonApiService, private formBuilder: FormBuilder, private router: Router, private communicate: CommunicateService, private activatedRoute: ActivatedRoute, private toastr: ToastrService) {
    this.addLocationForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.pattern(/^(?!(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|EXEC|ALTER|CREATE|TRUNCATE)|(['";\\])|(\b\d+\b)|(\/\*[\s\S]*?\*\/|--.*)|(AND|OR|NOT|XOR)|\b(?:SELECT|INSERT|UPDATE|DELETE|EXEC)\s*\(|(error|exception|warning))/i)]],
      about: ['', [Validators.required, Validators.maxLength(150), Validators.pattern(/^(?!(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|EXEC|ALTER|CREATE|TRUNCATE)|(['";\\])|(\b\d+\b)|(\/\*[\s\S]*?\*\/|--.*)|(AND|OR|NOT|XOR)|\b(?:SELECT|INSERT|UPDATE|DELETE|EXEC)\s*\(|(error|exception|warning))/i)]],
      account_id: '',
      website: ['', [Validators.required, Validators.pattern('(^((http|https)://)|((www)[.]))[A-Za-z0-9_@./#!$%^:*&+-]+([\-\.]{1}[a-z0-9]+)*\.(?:com|net|in|org|io)$')]],
      phone: ['', [Validators.required, , Validators.pattern('[6-9][0-9]{12}')]],
      mobile: ['', [Validators.required, Validators.pattern('[6-9][0-9]{12}')]],
      fax: ['', [Validators.pattern('^[0-9]*$'), Validators.minLength(10), Validators.maxLength(13)]],
      street: ['', [Validators.required, Validators.pattern(/^(?!(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|EXEC|ALTER|CREATE|TRUNCATE)|(['";\\])|(\b\d+\b)|(\/\*[\s\S]*?\*\/|--.*)|(AND|OR|NOT|XOR)|\b(?:SELECT|INSERT|UPDATE|DELETE|EXEC)\s*\(|(error|exception|warning))/i)]],
      city: ['', [Validators.required, Validators.pattern(/^(?!(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|EXEC|ALTER|CREATE|TRUNCATE)|(['";\\])|(\b\d+\b)|(\/\*[\s\S]*?\*\/|--.*)|(AND|OR|NOT|XOR)|\b(?:SELECT|INSERT|UPDATE|DELETE|EXEC)\s*\(|(error|exception|warning))/i)]],
      country: ['', [Validators.required, Validators.pattern(/^(?!(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|EXEC|ALTER|CREATE|TRUNCATE)|(['";\\])|(\b\d+\b)|(\/\*[\s\S]*?\*\/|--.*)|(AND|OR|NOT|XOR)|\b(?:SELECT|INSERT|UPDATE|DELETE|EXEC)\s*\(|(error|exception|warning))/i)]],
      state: ['', [Validators.required, Validators.pattern(/^(?!(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|EXEC|ALTER|CREATE|TRUNCATE)|(['";\\])|(\b\d+\b)|(\/\*[\s\S]*?\*\/|--.*)|(AND|OR|NOT|XOR)|\b(?:SELECT|INSERT|UPDATE|DELETE|EXEC)\s*\(|(error|exception|warning))/i)]],
      zip: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6), Validators.pattern('^[0-9]*$')]],
      logo: ['', [Validators.required]]
    });

  }

  ngOnInit() {
    let id: number;
    let localData: any = localStorage.getItem('Shared_Data');
    localData = JSON.parse(localData);
    this.addLocationForm.patchValue({
      account_id: localData.account_id
    });
    this.activatedRoute.queryParams.subscribe((paramMap: any) => {
      id = paramMap.id;
      if (id != null && id != undefined) {
        this.editLocation = true;
      }
    });

  }

  get formData() { return this.addLocationForm.controls }

  onSubmit() {
    if (this.addLocationForm.invalid) {
      this.isFormValid = true;
      return;
    }
    this.communicate.isLoaderLoad.next(true);
    this.addLocationForm.value.logo = this.imgURLBase64;
    let payload = { ...this.addLocationForm.value, logo: this.imgURLBase64 }
    this.api.allPostMethod("locations/location", this.addLocationForm.value).subscribe((resp_location: any) => {
      this.communicate.isLoaderLoad.next(false);
      if (resp_location['error'] != true) {
        this.addLocationForm.reset();
        this.toastr.success("Location added succesfully", "")
        this.router.navigate(['/create-user-location/location-detail']);
      } else {
        this.toastr.error(resp_location['message'], "")
      }
    });
  }

  onEditForm() {
    if (this.addLocationForm.invalid) {
      this.isFormValid = true;
      return;
    }
    this.addLocationForm.value.logo = this.imgURLBase64;
    console.log(this.addLocationForm.value);
    // this.api.allPostMethod("locations/updatelocation",this.addLocationForm.value).subscribe((updateLocation:any)=>{
    //   console.log("After Location update : ",updateLocation);
    // });
  }

  convertImageToBase64(file_event: any) {
    this.logoName = file_event?.target?.files[0]?.name
    const reader = new FileReader();
    reader.readAsDataURL(file_event.srcElement.files[0]);
    reader.onload = () => {
      this.imgURLBase64 = reader.result
    };
  }
}
