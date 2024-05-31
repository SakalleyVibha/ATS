import { Component, ViewChild, signal } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { EMPLOYER_NAME, MODE_OF_HIRE, PROJECT_STATUS, RELOCATION, RESUME_SOURCE, SALARY_TYPE, STATE_CONST, VISA_STATUS } from '../../../core/Constants/list.constant';
import { CommonApiService } from '../../../core/services/common-api.service';
import { ToastrService } from 'ngx-toastr';
import { CommunicateService } from '../../../core/services/communicate.service';
import { environment } from '../../../../environments/environment';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap'

@Component({
  selector: 'app-manage-candidate',
  templateUrl: './manage-candidate.component.html',
  styleUrl: './manage-candidate.component.css'
})
export class ManageCandidateComponent {


 @ViewChild('imageModal') content: any;  
  addCandidateForm!: FormGroup;
  isFieldsValid = signal<boolean>(false);
  modeHire = signal<any>(MODE_OF_HIRE);
  state = signal<any>(STATE_CONST);
  relocationList = signal<any>(RELOCATION);
  visaStatus = signal<any>(VISA_STATUS);
  projectStatus = signal<any>(PROJECT_STATUS);
  resumeSource = signal<any>(RESUME_SOURCE);
  employerName = signal<any>(EMPLOYER_NAME);
  salaryType = signal<any>(SALARY_TYPE);
  imgURLBase64 = signal<any>('');
  selectedFiles: FileList | null = null;
  documentList = signal<any>([]);
  resumeFileNames = signal<any>([]);
  imgBs64 = signal<string>('');
  sql_validation = signal(environment.SQL_validation);
  modalRef: any;
  constructor(private fb: FormBuilder, private api: CommonApiService, private toastr: ToastrService, private communicate: CommunicateService,private modalService: NgbModal) {
    let userData: any = localStorage.getItem('Shared_Data');
    if (userData) {
      userData = JSON.parse(userData)
    }
    this.createCandidateForm(userData?.account_id);
    this.addSkills();
    this.addEducation();
    this.addCert();
  }

  ngOnInit() { }

  get formData() { return this.addCandidateForm.controls };

  createCandidateForm(acc_id: number) {
    this.addCandidateForm = this.fb.group({
      account_id: new FormControl(acc_id),
      name: new FormControl('', [Validators.required, Validators.minLength(2)]),
      title: new FormControl('', [Validators.required, Validators.minLength(3)]),
      position: new FormControl('', [Validators.required, Validators.minLength(3)]),
      total_experience: new FormControl('', [Validators.required]),
      relevant_experience: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      linkedin: new FormControl(''),
      contact: new FormControl('', [Validators.required, Validators.pattern('[6-9][0-9]{12}')]),
      alternate_contact: new FormControl(''),
      city: new FormControl('', [Validators.required]),
      state: new FormControl('', [Validators.required]),
      mode_of_hire: new FormControl('', [Validators.required]),
      visa_status: new FormControl('', [Validators.required]),
      salary_type: new FormControl('', [Validators.required]),
      salary: new FormControl('', [Validators.required]),
      employer_name: new FormControl('', [Validators.required]),
      visa_validity: new FormControl('', [Validators.required]),
      dob: new FormControl('', [Validators.required]),
      relocation: new FormControl('', [Validators.required]),
      current_project_status: new FormControl('', [Validators.required]),
      joining_availability: new FormControl('', [Validators.required]),
      // education_detail: new FormControl('', [Validators.required]),
      graduation_completion_year: new FormControl('', [Validators.required]),
      resume_source: new FormControl('', [Validators.required]),
      logo: new FormControl('', [Validators.required]),
      notes: new FormControl('', [Validators.required]),
      employment_history: this.fb.array([], Validators.required),
      education_detail: this.fb.array([]),
      certificates: this.fb.array([]),
    });

  }

  get employment_history(): FormArray {
    return this.addCandidateForm.get("employment_history") as FormArray
  }

  get education_detail(): FormArray {
    return this.addCandidateForm.get("education_detail") as FormArray
  }

  get certificates(): FormArray {
    return this.addCandidateForm.get("certificates") as FormArray
  }

  addSkills() {
    this.employment_history.push(
      this.fb.group({
        company_name: new FormControl('', [Validators.required]),
        from_date: new FormControl('', [Validators.required]),
        to_date: new FormControl('', [Validators.required])
      }));
  }

  addEducation() {
    this.education_detail.push(
      this.fb.group({
        qualification: new FormControl('', [Validators.required]),
        course: new FormControl('', [Validators.required]),
        university: new FormControl('', [Validators.required])
      })
    );
  }

  addCert() {
    this.certificates.push(
      this.fb.group({
        name: new FormControl('', [Validators.required]),
        validity: new FormControl('', [Validators.required]),
        attachment: new FormControl('', [Validators.required])
      })
    );
  }

  removeSkill(i: number) {
    this.employment_history.removeAt(i);
  }

  removeEducation(i: number) {
    this.education_detail.removeAt(i);
  }

  removeCertificate(i: number) {
    this.certificates.removeAt(i);
  }

  convertImageToBase64(file_event: any) {
    return new Promise((resolve, reject) => {

      const reader = new FileReader();
      reader.readAsDataURL(file_event);
      reader.onload = async () => {
        this.imgURLBase64.set(reader.result);
        if (this.imgURLBase64()) {
          resolve(true);
        } else {
          resolve(false);
        }

      };
    })
  }

  async onFileChange(event: any) {
    if (event.dataTransfer) {
      let file = event.dataTransfer.files
      this.addCandidateForm.controls['logo'].removeValidators(Validators.required);
      this.addCandidateForm.controls['logo'].updateValueAndValidity();
      let bs64Value = await this.convertImageToBase64(file[0]);
      return
    }
    if (event.srcElement && event.srcElement != undefined) {
      let file = event.srcElement.files
      let bs64Value = await this.convertImageToBase64(file[0]);
    }
  }

  CrossBtn() {
    this.imgURLBase64.set('');
    this.addCandidateForm.get('logo')?.setValue('');
    this.addCandidateForm.controls['logo'].addValidators(Validators.required);
    this.addCandidateForm.controls['logo'].updateValueAndValidity();
  }

  onFileChangePDF(event: any) {
    this.selectedFiles = event.target.files;
    this.convertFilesToBase64()
  }

  async convertFilesToBase64() {
    console.log("Here");

    if (!this.selectedFiles) {
      return; // Handle no files selected case
    }

    const base64Files: { [key: string]: string } = {};
    for (let i = 0; i < this.selectedFiles.length; i++) {
      const file = this.selectedFiles[i];
      console.log('file: ', file);
      this.resumeFileNames().push(file.name);
      const reader = new FileReader();

      reader.onload = (event: any) => {
        base64Files[file.name] = event.target.result.split(',')[1]; // Remove data:application/pdf;base64, prefix
        this.documentList().push({ docType: 'resume', doc: base64Files[file.name], fileName: file.name })
      };
      console.log("this.resumeFileNames() : ", this.resumeFileNames());

      reader.readAsDataURL(file);
    }

    // Handle converted base64 files (e.g., send to server)
    console.log(base64Files);

  }

  deleteFromArray(index: number) {
    this.resumeFileNames().slice(index, 1);
    let idx = this.documentList().findIndex((data: any) => data.fileName == this.resumeFileNames()[index]);
    if (idx != -1) {
      this.documentList().slice(idx, 1);
    }
  }

  saveCandidateForm() {
    if (this.addCandidateForm.value.mode_of_hire != 'c2c') {
      this.addCandidateForm.controls['employer_name'].removeValidators(Validators.required);
      this.addCandidateForm.controls['employer_name'].updateValueAndValidity();
    }
    this.addCandidateForm.value.logo = this.imgURLBase64();
    if (this.addCandidateForm.invalid) {
      this.isFieldsValid.set(true);
      return;
    }
    let req = { ...this.addCandidateForm.value, documents: this.documentList() };
    console.log('req: ', req);
    this.communicate.isLoaderLoad.next(true);
    this.api.allPostMethod("candidates/addCandidate", req).subscribe((res: any) => {
      console.log('res: ', res);
      this.communicate.isLoaderLoad.next(false);
      if (res['error'] != true) {
        if (res['data']) {
          this.toastr.success("Candidate created successfully", "")
        } else {
          this.toastr.error("Something went wrong", "");
        }
      } else {
        this.toastr.error("Something went wrong", "");
      }
    });
  }

  determineWorkStatus(event: any, index: number, validatorName: string) {
    const employmentGroup = this.employment_history.at(index) as FormGroup;
    const toDateControl = employmentGroup.get('to_date');

    if (event.target.checked) {
      toDateControl?.clearValidators();
    } else {
      toDateControl?.setValidators(Validators.required);
    }

    toDateControl?.updateValueAndValidity();

    console.log("this.employment_history : ", this.employment_history);

  }

  async handleUpload(event: any, i: number) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);

    let valueImg = await new Promise((resolve, reject) => {
      reader.onload = () => {
        const cert = this.certificates.at(i) as FormGroup;
        const base64String = reader.result as string;
        this.imgBs64.set(base64String);
        if (this.imgBs64() != '') {
          resolve(true);
        } else {
          resolve(false);
        }
      };
    })

    reader.onerror = (error) => {
      console.error('Error reading file:', error);
    };

    if (valueImg) {
      const cert = this.certificates.at(i) as FormGroup;
      cert.value.attachment = this.imgBs64()
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
