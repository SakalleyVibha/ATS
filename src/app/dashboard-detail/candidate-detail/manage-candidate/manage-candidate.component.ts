import { Component, ViewChild, signal } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { EMPLOYER_NAME, MODE_OF_HIRE, PROJECT_STATUS, RELOCATION, RESUME_SOURCE, SALARY_TYPE, STATE_CONST, VISA_STATUS } from '../../../core/Constants/list.constant';
import { CommonApiService } from '../../../core/services/common-api.service';
import { ToastrService } from 'ngx-toastr';
import { CommunicateService } from '../../../core/services/communicate.service';
import { environment } from '../../../../environments/environment';
import { NgbModal, NgbModalOptions, NgbModalRef } from '@ng-bootstrap/ng-bootstrap'
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatestWith, map } from 'rxjs';

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
  determineSubmission = signal<any>({});
  account_id = signal<number>(0);
  resCandidate = signal<any>([]);
  educationDeletion = signal<any>([]);
  employmentDeletion = signal<any>([]);
  candidateId = signal<any>(0);
  selectedImageName: string = '';
  selectedAttachmentName: string = '';
  selectedResumeName: string = '';
  constructor(private router: Router, private fb: FormBuilder, private api: CommonApiService, private toastr: ToastrService, private communicate: CommunicateService, private activeRoute: ActivatedRoute, private modalService: NgbModal) {


    let userData: any = localStorage.getItem('Shared_Data');
    if (userData) {
      userData = JSON.parse(userData)
      this.account_id.set(userData?.account_id);
    }
    this.createCandidateForm(userData?.account_id);

  }

  ngOnInit() {
    this.activeRoute.url
      .pipe(
        combineLatestWith(this.activeRoute.queryParams),
        map(([url, queryParams]) => ({ path: url[0].path, id: queryParams['id'], section: queryParams['section'] }))
      )
      .subscribe(results => {
        this.determineSubmission.set(results);
        console.log('results: ', results);
        if (results.path == 'edit') {
          this.setDataToEdit(results);
        } else {
          this.addSkills();
          this.addEducation();
          this.addCert();
        }
      });
  }

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
      })
    );
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
    if (this.determineSubmission().path == 'edit') {
      const control = this.employment_history.at(i) as FormGroup;
      control.addControl('delete', new FormControl(true));
      this.employmentDeletion.set(this.employment_history.value);
    }
    console.log('this.employment_history.value: ', this.employment_history.value);
    this.employment_history.removeAt(i);
  }

  removeEducation(i: number) {
    if (this.determineSubmission().path == 'edit') {
      const control = this.education_detail.at(i) as FormGroup;
      control.addControl('delete', new FormControl(true));
      this.educationDeletion.set(this.education_detail.value);
    }
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
    this.selectedImageName = event.target.files[0]?.name;
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

  onAttachmentFileChange(event: any) {
    this.selectedAttachmentName = event.target.files[0]?.name;
  }
  onResumeFileChange(event: any) {
    this.selectedResumeName = event.target.files[0]?.name;
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
          this.toastr.success("Candidate created successfully", "");
          this.router.navigate(['dashboard-detail/candidate-detail'])
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

  viewImagePopup() {
  
    this.modalRef = this.modalService.open(this.content, { centered: true, size: 'sm', backdrop: 'static', keyboard: false } );  // Open the modal with template reference

    // Handle modal dismiss reason (optional)
  }

  closeModal() {
    if (this.modalRef) {
      this.modalRef.dismiss('cross click'); // Dismiss the modal
    }
  }
  setDataToEdit(results: any) {
    this.communicate.isLoaderLoad.next(true);
    this.api.allPostMethod("candidates/getcandidate", { account_id: this.account_id(), id: results.id }).subscribe((res: any) => {
      this.communicate.isLoaderLoad.next(false);
      if (res['data'] != true) {
        this.candidateId.set(res['data'].id)
        this.resCandidate.set(results.section);
        console.log('this.resCandidate: ', this.resCandidate());
        if (res['data']) {
          switch (results.section) {
            case 'edit-emp': {
              if (res['data'].candidate_companies && res['data'].candidate_companies.length > 0) {
                res['data'].candidate_companies.map((data: any, index: number) => {
                  this.employment_history.push(
                    this.fb.group({
                      company_name: new FormControl('', [Validators.required]),
                      from_date: new FormControl('', [Validators.required]),
                      to_date: new FormControl('', [Validators.required]),
                      id: new FormControl('')
                    })
                  );
                  this.employment_history.at(index).patchValue({
                    company_name: data?.company_name,
                    from_date: data?.from_date,
                    to_date: data?.to_date,
                    id: data?.id
                  });

                })
              }
              break;
            }
            case 'edit-edu': {
              if (res['data'].candidate_education_details && res['data'].candidate_education_details.length > 0) {
                res['data'].candidate_education_details.map((data: any, index: number) => {
                  this.education_detail.push(
                    this.fb.group({
                      qualification: new FormControl('', [Validators.required]),
                      course: new FormControl('', [Validators.required]),
                      university: new FormControl('', [Validators.required]),
                      id: new FormControl(''),
                    })
                  );
                  this.education_detail.at(index).patchValue({
                    qualification: data?.qualification,
                    course: data?.course,
                    university: data?.university,
                    id: data?.id
                  });
                })
              }
              break;
            }
            case 'edit-cert': {
              if (res['data'].candidate_certifications && res['data'].candidate_certifications.length > 0) {
                res['data'].candidate_certifications.map((data: any, index: number) => {
                  if (index > 0) {
                    this.certificates.push(
                      this.fb.group({
                        name: new FormControl('', [Validators.required]),
                        validity: new FormControl('', [Validators.required]),
                        attachment: new FormControl('', [Validators.required])
                      })
                    );
                  }
                  this.certificates.at(index).patchValue({
                    name: data?.name,
                    validity: data?.validity,
                    attachment: data?.attachment
                  });
                })
              }
              break;
            }
            case 'edit-doc': {
              if (res['data'].candidate_documents && res['data'].candidate_documents.length > 0) {
                // res['data'].candidate_documents.map((data: any, index: number) => {

                // })
              }
              break;
            }
            default: {
              this.addCandidateForm.patchValue({
                name: res['data'].name,
                title: res['data'].title,
                position: res['data'].position,
                total_experience: res['data'].total_experience,
                relevant_experience: res['data'].relevant_experience,
                email: res['data'].email,
                linkedin: res['data'].linkedin,
                contact: res['data'].contact,
                alternate_contact: res['data'].alternate_contact,
                city: res['data'].city,
                state: res['data'].state,
                mode_of_hire: res['data'].mode_of_hire,
                visa_status: res['data'].visa_status,
                salary_type: res['data'].salary_type,
                salary: res['data'].salary,
                employer_name: res['data'].employer_name,
                visa_validity: res['data'].visa_validity,
                dob: res['data'].dob,
                relocation: res['data'].relocation,
                current_project_status: res['data'].current_project_status,
                joining_availability: res['data'].joining_availability,
                graduation_completion_year: res['data'].graduation_completion_year,
                resume_source: res['data'].resume_source,
                logo: res['data'].logo,
                notes: res['data'].notes
              });
              break;
            }
          }
        }
      }

    });
  }

  determineFormSubmission() {
    if (this.determineSubmission().path == 'edit') {
      switch (this.resCandidate()) {
        case 'edit-emp': {
          this.editEmployeeSubmission();
          break;
        }
        case 'edit-edu': {
          this.editEducationSubmission();
          break;
        }
        case 'edit-cert': {
          this.editCertificateSubmission();
          break;
        }
        case 'edit-doc': {
          this.editDocumentSubmission();
          break;
        }
        default: {
          this.editCandidate();
          break;
        }
      }
    } else {
      this.saveCandidateForm();
    }
  }

  editEmployeeSubmission() {
    if (this.employment_history.invalid) {
      this.isFieldsValid.set(true);
      return;
    }
    let reqData = { companyData: this.employmentDeletion() && this.employmentDeletion().length > 0 ? this.employmentDeletion() : this.employment_history.value, account_id: this.account_id(), candidate_id: this.candidateId() };
    console.log('reqData: ', reqData);
    this.communicate.isLoaderLoad.next(true);
    this.api.allPostMethod('candidates/updateCompanyDetails', reqData).subscribe((res: any) => {
      this.communicate.isLoaderLoad.next(false);
      if (res['error'] != true) {
        if (res['data']) {
          this.toastr.success("Updated successfully", "")
          this.router.navigate(['dashboard-detail/candidate-detail'])
        } else {
          this.toastr.error("Something went wrong", "");
        }
      } else {
        this.toastr.error("Something went wrong", "");
      }

    })
  }

  editEducationSubmission() {
    if (this.education_detail.invalid) {
      this.isFieldsValid.set(true);
      return;
    }
    let req = { educationList: this.educationDeletion() && this.educationDeletion().length > 0 ? this.educationDeletion() : this.education_detail.value, account_id: this.account_id(), candidate_id: this.candidateId() };
    this.communicate.isLoaderLoad.next(true);
    this.api.allPostMethod('candidates/updateEducationDetails', req).subscribe((res: any) => {
      this.communicate.isLoaderLoad.next(false);
      if (res['error'] != true) {
        if (res['data']) {
          this.toastr.success("Updated successfully", "")
          this.router.navigate(['dashboard-detail/candidate-detail'])
        } else {
          this.toastr.error("Something went wrong", "");
        }
      } else {
        this.toastr.error("Something went wrong", "");
      }

    })
  }

  editCertificateSubmission() {
    if (this.certificates.invalid) {
      this.isFieldsValid.set(true);
      return;
    }
    let reqData = this.employment_history.value
    console.log('reqData: ', reqData);
  }

  editDocumentSubmission() {
    if (this.documentList() && this.documentList().length == 0) {
      this.isFieldsValid.set(true);
      return;
    }
    let reqData = this.employment_history.value
    console.log('reqData: ', reqData);
  }

  editCandidate() {
    // this.addCandidateForm.get('employment_history')?.removeControl('address2');
  }
}
