import { Component, ViewChild, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CommonApiService } from '../../../core/services/common-api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommunicateService } from '../../../core/services/communicate.service';
import { environment } from '../../../../environments/environment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-manage-location',
  templateUrl: './manage-location.component.html',
  styleUrl: './manage-location.component.css'
})
export class ManageLocationComponent {
  @ViewChild('imageModal') content: any;  
  addLocationForm: FormGroup;
  isFormValid = signal(false);
  editLocation: boolean = false;
  logoName: string = '';
  imgURLBase64 = signal<ArrayBuffer | any>('');
  isActive:boolean = true;
  sql_validation = signal(environment.SQL_validation);
  website_validate = signal(environment.website_validation);
  number_validation = signal(environment.Phone_Mobile_valid);
  modalRef: any;

  constructor(private api: CommonApiService, private formBuilder: FormBuilder, private router: Router, private activatedRoute: ActivatedRoute, private toastr: ToastrService, private communicate: CommunicateService, private modalService: NgbModal) {
    this.addLocationForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.pattern(this.sql_validation())]],
      about: ['', [Validators.required, Validators.maxLength(150), Validators.pattern(this.sql_validation())]],
      account_id: '',
      website: ['', [Validators.required, Validators.pattern(this.website_validate())]],
      phone: ['', [Validators.required, , Validators.pattern(this.number_validation())]],
      mobile: ['', [Validators.required, Validators.pattern(this.number_validation())]],
      fax: ['', [Validators.pattern('^[0-9]*$'), Validators.minLength(10), Validators.maxLength(13)]],
      street: ['', [Validators.required, Validators.pattern(this.sql_validation())]],
      city: ['', [Validators.required, Validators.pattern(this.sql_validation())]],
      country: ['', [Validators.required, Validators.pattern(this.sql_validation())]],
      state: ['', [Validators.required, Validators.pattern(this.sql_validation())]],
      zip: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6), Validators.pattern('^[0-9]*$')]],
      logo: ['', [Validators.required]],
      status: ['']
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
        this.communicate.isLoaderLoad.next(true);
        this.api.allPostMethod("locations/getlocation", { id: Number(id), account_id: localData?.account_id }).subscribe((res: any) => {
          let editableData = res['data'];
          this.addLocationForm.patchValue({
            name: editableData?.name,
            about: editableData?.about,
            account_id: editableData?.account_id,
            website: editableData?.website,
            phone: editableData?.phone,
            mobile: editableData?.mobile,
            fax: editableData?.fax,
            street: editableData?.street,
            city: editableData?.city,
            country: editableData?.country,
            state: editableData?.state,
            zip: editableData?.zip,
          });
          this.isActive = editableData?.status;
          this.imgURLBase64.set(editableData?.logo);          
          this.addLocationForm.controls['logo'].clearValidators();
          this.addLocationForm.controls['logo'].updateValueAndValidity();
          this.addLocationForm.setControl('id', new FormControl(id));
          this.communicate.isLoaderLoad.next(false);
        });
      }
    });

  }

  get formData() { return this.addLocationForm.controls }

  onSubmit() {   
    if (this.addLocationForm.invalid) {
      this.isFormValid.set(true);
      return;
    }
    this.communicate.isLoaderLoad.next(true);
    this.addLocationForm.get('status')?.patchValue(Number(this.isActive));
    let payload = {...this.addLocationForm.value,logo: this.imgURLBase64()};
    this.api.allPostMethod("locations/location", payload).subscribe((resp_location: any) => {
      if (resp_location.message) {
        this.addLocationForm.reset();
        this.toastr.success("Location added succesfully", "", { closeButton: true, timeOut: 5000 }).onHidden.subscribe(() => {
          this.communicate.isLoaderLoad.next(false);
         
          let isSkip:any = localStorage.getItem('isDashboardDetail');
          if(!JSON.parse(isSkip)){
            let payLoad = { account_id: this.addLocationForm.value.account_id, pageNumber: 1, pageSize: 10 };
            this.api.allPostMethod("users/getUserList", payLoad).subscribe({
              next: (res:any)=>{
                 let userList = res.data || [];
                 userList = userList.filter((v:any) => !v.is_owner);
                 if(!userList.length){
                  this.router.navigate(['dashboard-detail','user-detail']);
                 }else{
                    this.communicate.isDetailSideShow.next(true);
                    this.router.navigate(['/dashboard-detail/location-detail']);
                 }
              }
            })
          }else{
            this.communicate.isDetailSideShow.next(true);
            this.router.navigate(['/dashboard-detail/location-detail']);
          }
        });
      } else {
        this.toastr.error("Something went wrong, Please try again later", "", { closeButton: true, timeOut: 5000 }).onHidden.subscribe(() => {
          this.communicate.isLoaderLoad.next(false);
        });
      }
    });
  }

  onEditForm() {
    if (this.addLocationForm.invalid) {
      this.isFormValid.set(true);
      return;
    }
    this.communicate.isLoaderLoad.next(true);
    this.addLocationForm.get('status')?.patchValue(Number(this.isActive));
    let isBase64 = this.communicate.isBase64(this.imgURLBase64());
    let payload = {...this.addLocationForm.value,logo: (isBase64 ? this.imgURLBase64() : false)};

    this.api.allPostMethod("locations/updatelocation", payload).subscribe((updateLocationResponse: any) => {
      if (updateLocationResponse?.error != false) {
        this.toastr.success("Location updated", "", { closeButton: true, timeOut: 5000 }).onHidden.subscribe(() => {
          this.communicate.isLoaderLoad.next(false);
          this.router.navigate(['/dashboard-detail/location-detail']);
        })
      } else {
        this.toastr.error("Location not updated, Please try again later !", "", { closeButton: true, timeOut: 5000 }).onHidden.subscribe(() => {
          this.communicate.isLoaderLoad.next(false);
        });
      }
    });
  }

  convertImageToBase64(file_event: any) {
    const reader = new FileReader();
    reader.readAsDataURL(file_event);
    reader.onload = () => {
      this.imgURLBase64.set(reader.result)
    };
  }

  CrossBtn(){
    this.imgURLBase64.set('');
    this.addLocationForm.get('logo')?.setValue('');
    this.addLocationForm.controls['logo'].addValidators(Validators.required);
    this.addLocationForm.controls['logo'].updateValueAndValidity();
  }

  onFileChange(event:any){
    if(event.dataTransfer){
      let file = event.dataTransfer.files
      this.addLocationForm.controls['logo'].clearValidators();
      this.addLocationForm.controls['logo'].updateValueAndValidity();
      this.convertImageToBase64(file[0]);
      return
    }
    if(event.srcElement && event.srcElement!= undefined){
      let file = event.srcElement.files
      this.convertImageToBase64(file[0]);
    }
  }

  viewImagePopup(){
    this.modalRef = this.modalService.open(this.content, { centered: true , size:'xl'});  // Open the modal with template reference

    // Handle modal dismiss reason (optional)
  }
  
  closeModal() {
    if (this.modalRef) {
      this.modalRef.dismiss('cross click'); // Dismiss the modal
    }
  }
}
