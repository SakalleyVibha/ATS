import { Component, signal } from '@angular/core';
import { CommonApiService } from '../../../core/services/common-api.service';
import { CommunicateService } from '../../../core/services/communicate.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { single } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-manage-team',
  templateUrl: './manage-team.component.html',
  styleUrl: './manage-team.component.css'
})
export class ManageTeamComponent {

  imgURLBase64 = signal<ArrayBuffer | any>('');
  teamForm: FormGroup
  isFieldsValid = signal(false);
  Teamedit = signal(false);
  sql_validation = signal(environment.SQL_validation);
  isActive = signal(true);

  constructor(private api: CommonApiService, private communicate: CommunicateService, private formbuild: FormBuilder,private toastr: ToastrService,private router:Router,private activeRout:ActivatedRoute) {
    let user_data: any = localStorage.getItem('Shared_Data');
    user_data = JSON.parse(user_data);
    this.teamForm = this.formbuild.group({
      account_id: new FormControl(user_data?.account_id),
      name: new FormControl('', [Validators.required]),
      about: new FormControl('', [Validators.required, Validators.maxLength(150), Validators.pattern(this.sql_validation())]),
      logo: new FormControl('', [Validators.required]),
      status: new FormControl('')
    });
  }

  ngOnInit(){
    this.activeRout.queryParams.subscribe((res:any)=>{
      if(res.id != null || res.id != undefined ){
        this.communicate.isLoaderLoad.next(true);
        this.api.allPostMethod("team/getTeam",res).subscribe((updateData:any)=>{
          this.Teamedit.set(true);
          console.log(updateData);
          updateData = updateData.data;
          this.teamForm.patchValue({
            name: updateData?.name,
            about : updateData?.about,
            account_id : updateData?.account_id
          });
          this.isActive.set(updateData?.status);
          this.imgURLBase64.set(updateData?.logo);
          this.teamForm.addControl('id', new FormControl(updateData?.id));
          this.teamForm.controls['logo'].removeValidators(Validators.required);
          this.teamForm.controls['logo'].updateValueAndValidity();
          this.communicate.isLoaderLoad.next(false);
        });
      }
    });
  }

  get formData() { return this.teamForm.controls };

  onFormSubmit() {
    if(this.teamForm.invalid){
      this.isFieldsValid.set(true);
      return;
    }
    this.communicate.isLoaderLoad.next(true);
    let token = {...this.teamForm.value, logo: this.imgURLBase64(),status: Number(this.isActive())};
    this.api.allPostMethod("team/addTeam", token).subscribe((res:any) => {
      if(res['data']){
        this.toastr.success("Team created successfully","",{timeOut:5000,closeButton:true}).onHidden.subscribe(()=>{
          this.communicate.isLoaderLoad.next(false);
          this.router.navigate(['/dashboard-detail/team']);
        })
      }else{
        this.toastr.error("Something went wrong","",{timeOut:5000,closeButton:true}).onHidden.subscribe(()=>{
          this.communicate.isLoaderLoad.next(false);
        })
      }
    });
   }

  onEditTeam() {
    if(this.teamForm.invalid){
      this.isFieldsValid.set(true);
      return;
    }
    this.communicate.isLoaderLoad.next(true);
    let payload;
    let isBase64 = this.communicate.isBase64(this.imgURLBase64()); 

    payload = {...this.teamForm.value, logo: (isBase64 ? this.imgURLBase64() : false),status: Number(this.isActive())};
    console.log(payload);
    this.api.allPostMethod("team/updateTeam", payload).subscribe((res:any) => {
      console.log(res);
      if(res.data.length > 0){
        this.toastr.success("Team update successfully","",{ closeButton:true,timeOut:5000 }).onHidden.subscribe(()=>{
          this.router.navigate(['dashboard-detail/team']);
          this.communicate.isLoaderLoad.next(false);
        })
      }else{
        this.toastr.error("Something went wrong","",{ closeButton:true,timeOut:5000 }).onHidden.subscribe(()=>{
          this.communicate.isLoaderLoad.next(false);
        });
      }
    });
   }

  convertImageToBase64(file_event: any) {
    const reader = new FileReader();
    reader.readAsDataURL(file_event);
    reader.onload = async () => {
      this.imgURLBase64.set(reader.result);
    };
  }

  CrossBtn() {
    this.imgURLBase64.set('');
    this.teamForm.get('logo')?.setValue('');
    this.teamForm.controls['logo'].addValidators(Validators.required);
    this.teamForm.controls['logo'].updateValueAndValidity();
  }

  onFileChange(event: any) {
    if (event.dataTransfer) {
      let file = event.dataTransfer.files
      this.teamForm.controls['logo'].removeValidators(Validators.required);
      this.teamForm.controls['logo'].updateValueAndValidity();
      this.convertImageToBase64(file[0]);
      return
    }
    if (event.srcElement && event.srcElement != undefined) {
      let file = event.srcElement.files
      this.convertImageToBase64(file[0]);
    }
  }
}
