import { Component, ViewChild, signal } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { EMPLOYER_NAME, MODE_OF_HIRE, PROJECT_STATUS, RELOCATION, RESUME_SOURCE, SALARY_TYPE, STATE_CONST, STATUS_LIST, VISA_STATUS } from '../../../core/Constants/list.constant';
import { CommonApiService } from '../../../core/services/common-api.service';
import { ToastrService } from 'ngx-toastr';
import { CommunicateService } from '../../../core/services/communicate.service';
import { environment } from '../../../../environments/environment';
import { NgbModal, NgbModalOptions, NgbModalRef } from '@ng-bootstrap/ng-bootstrap'
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatestWith, filter, map } from 'rxjs';
import { DatePipe } from '@angular/common';

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
  statusList = signal<any>(STATUS_LIST);
  employerName = signal<any>(EMPLOYER_NAME);
  salaryType = signal<any>(SALARY_TYPE);
  imgURLBase64 = signal<any>('');
  selectedFiles: FileList | null = null;
  documentList = signal<any>([]);
  qualificationList = signal<any>([]);
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
  getCandidateData = signal<any>([]);
  number_validation = signal(environment.Phone_Mobile_valid);
  date: any;
  constructor(private router: Router, private fb: FormBuilder, private api: CommonApiService, private toastr: ToastrService, private communicate: CommunicateService, private activeRoute: ActivatedRoute, private modalService: NgbModal, private datePipe: DatePipe) {


    let userData: any = localStorage.getItem('Shared_Data');
    if (userData) {
      userData = JSON.parse(userData)
      this.account_id.set(userData?.account_id);
    }
    this.createCandidateForm(userData?.account_id);
    this.getQualificationList();
  }

  ngOnInit() {

    this.date = new Date;

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
          this.addDoc();
        }
      });
  }

  get formData() { return this.addCandidateForm.controls };

  getToday(): string {
    return new Date().toISOString().split('T')[0];
  }

  createCandidateForm(acc_id: number) {
    this.addCandidateForm = this.fb.group({
      account_id: new FormControl(acc_id),
      name: new FormControl('', [Validators.required, Validators.minLength(2)]),
      title: new FormControl('', [Validators.required, Validators.minLength(3)]),
      total_experience: new FormControl('', [Validators.required]),
      relevant_experience: new FormControl('', [Validators.required]),
      status: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      linkedin: new FormControl(''),
      contact: new FormControl('', [Validators.required, Validators.pattern(this.number_validation())]),
      alternate_contact: new FormControl(''),
      city: new FormControl('', [Validators.required]),
      state: new FormControl('', [Validators.required]),
      zipcode: new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(6)]),
      address: new FormControl('', [Validators.required]),
      address2: new FormControl(''),
      mode_of_hire: new FormControl('', [Validators.required]),
      visa_status: new FormControl('', [Validators.required]),
      salary_type: new FormControl('', [Validators.required]),
      salary: new FormControl('', [Validators.required, Validators.pattern(/^[0-9]+$/)]),
      employer_name: new FormControl('', [Validators.required]),
      visa_validity: new FormControl('', [Validators.required]),
      dob: new FormControl('', [Validators.required, this.mustBe18Validator]),
      relocation: new FormControl('', [Validators.required]),
      current_project_status: new FormControl('', [Validators.required]),
      joining_availability: new FormControl('', [Validators.required]),
      resume_source: new FormControl('', [Validators.required]),
      profile_image: new FormControl('', [Validators.required]),
      notes: new FormControl('', [Validators.required]),
      employment_history: this.fb.array([]),
      education_detail: this.fb.array([]),
      certificates: this.fb.array([]),
      documents: this.fb.array([]),
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

  get documents(): FormArray {
    return this.addCandidateForm.get("documents") as FormArray
  }

  addSkills() {
    const employmentGroup = this.employment_history.at(this.employment_history.length - 1) as FormGroup;
    const toDateControl = employmentGroup?.get('to_date');
    toDateControl?.setValue('');
    toDateControl?.setValidators(Validators.required);
    toDateControl?.updateValueAndValidity();
    this.employment_history.push(
      this.fb.group({
        company_name: new FormControl('', [Validators.required]),
        position: new FormControl('', [Validators.required, Validators.minLength(3)]),
        from_date: new FormControl('', [Validators.required]),
        to_date: new FormControl('', [Validators.required])
      })
    );
    this.calculateTotalExperience();
  }

  addEducation() {
    this.education_detail.push(
      this.fb.group({
        qualification: new FormControl('', [Validators.required]),
        qualification_id: new FormControl('', [Validators.required]),
        completion_year: new FormControl('', [Validators.required, Validators.max(new Date().getFullYear())]),
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

  addDoc() {
    this.documents.push(
      this.fb.group({
        docType: new FormControl(''),
        name: new FormControl('', [Validators.required]),
        doc: new FormControl('', [Validators.required]),
        fileName: new FormControl('', [])
      }
      ))
  }

  removeSkill(i: number) {
    if (this.determineSubmission().path == 'edit') {
      const control = this.employment_history.at(i) as FormGroup;
      if (control.value.id == '' || control.value.id == null) {
        this.employment_history.removeAt(i);
      } else {
        control.addControl('deleted', new FormControl(1));
        control.get('company_name')?.clearValidators();
        control.get('position')?.clearValidators();
        control.get('from_date')?.clearValidators();
        control.get('to_date')?.clearValidators();
        control.get('company_name')?.updateValueAndValidity();
        control.get('position')?.updateValueAndValidity();
        control.get('from_date')?.updateValueAndValidity();
        control.get('to_date')?.updateValueAndValidity();
      }

    } else {

      this.employment_history.removeAt(i);
      this.calculateTotalExperience();
    }
    // this.employment_history.removeAt(i);
  }

  removeEducation(i: number) {
    if (this.determineSubmission().path == 'edit') {

      const control = this.education_detail.at(i) as FormGroup;
      if (control.value.id == '' || control.value.id == null) {
        this.education_detail.removeAt(i);
      } else {
        control.addControl('deleted', new FormControl(1));
        control.get('qualification')?.clearValidators();
        control.get(' qualification_id')?.clearValidators();
        control.get('completion_year')?.clearValidators();
        control.get('university')?.clearValidators();
        control.get('course')?.clearValidators();
        control.get('qualification')?.updateValueAndValidity();
        control.get(' qualification_id')?.updateValueAndValidity();
        control.get('completion_year')?.updateValueAndValidity();
        control.get('university')?.updateValueAndValidity();
        control.get('course')?.updateValueAndValidity();
      }
    } else {

      this.education_detail.removeAt(i);
    }
  }

  removeCertificate(i: number) {
    this.certificates.removeAt(i);
  }

  removeDocument(i: number) {
    this.documents.removeAt(i);
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
      this.addCandidateForm.controls['profile_image'].removeValidators(Validators.required);
      this.addCandidateForm.controls['profile_image'].updateValueAndValidity();
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
    this.addCandidateForm.get('profile_image')?.setValue('');
    this.addCandidateForm.controls['profile_image'].addValidators(Validators.required);
    this.addCandidateForm.controls['profile_image'].updateValueAndValidity();
  }

  onFileChangePDF(event: any, i: number) {
    this.selectedFiles = event.target.files;
    this.convertFilesToBase64(i)

  }

  async convertFilesToBase64(i: number) {
    console.log("Here");

    if (!this.selectedFiles) {
      return; // Handle no files selected case
    }
    console.log(' this.document.value: ', this.documents.value);

    const base64Files: { [key: string]: string } = {};
    for (let i = 0; i < this.selectedFiles.length; i++) {
      const file = this.selectedFiles[i];
      let control = this.documents.at(i) as FormGroup;
      control.get('name')?.patchValue(file.name);
      console.log('file: ', file);
      this.resumeFileNames().push(file.name);
      const reader = new FileReader();

      reader.onload = (event: any) => {
        base64Files[file.name] = event.target.result.split(',')[1]; // Remove data:application/pdf;base64, prefix
        control.value.doc = base64Files[file.name]
        control.value.fileName = file.name
      };

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
    this.addCandidateForm.value.profile_image = this.imgURLBase64();
    console.log('this.addCandidateForm.value: ', this.addCandidateForm.value);
    console.log('this.addCandidateForm: ', this.addCandidateForm);
    // if (this.certificates.length == 0) {

    // }
    console.log('this.addCandidateForm.invalid: ', this.addCandidateForm.invalid);
    if (this.addCandidateForm.invalid) {
      this.isFieldsValid.set(true);
      return;
    }
    let req = { ...this.addCandidateForm.value };
    console.log('req: ', req);
    this.communicate.isLoaderLoad.next(true);
    this.api.allPostMethod("candidates/addCandidate", req).subscribe((res: any) => {
      console.log('res: ', res);
      this.communicate.isLoaderLoad.next(false);
      if (res['error'] != true) {
        this.toastr.success("Candidate created successfully", "");
        this.router.navigate(['dashboard-detail/candidate-detail'])
      } else {
        this.toastr.error(res['message'], "");
      }
    });
  }

  determineWorkStatus(event: any, index: number, validatorName: string) {
    const employmentGroup = this.employment_history.at(index) as FormGroup;
    const toDateControl = employmentGroup.get('to_date');

    if (event.target.checked) {
      let date = new Date();
      toDateControl?.clearValidators();
      toDateControl?.patchValue(this.datePipe.transform(date, 'yyyy-MM-dd'));
      this.calculateTotalExperience()
    } else {
      toDateControl?.setValue('');
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
      cert.value['fileName'] = file.name;
    }

  }

  viewImagePopup() {

    this.modalRef = this.modalService.open(this.content, { centered: true, size: 'sm', backdrop: 'static', keyboard: false });  // Open the modal with template reference

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
      if (res['error'] != true) {
        this.candidateId.set(res['data'].id)
        this.resCandidate.set(results.section);
        this.getCandidateData.set(res['data']);
        console.log('this.resCandidate: ', this.resCandidate());
        if (res['data']) {
          switch (results.section) {
            case 'edit-emp': {
              if (res['data'].candidate_companies && res['data'].candidate_companies.length > 0) {
                res['data'].candidate_companies.map((data: any, index: number) => {
                  this.employment_history.push(
                    this.fb.group({
                      company_name: new FormControl('', [Validators.required]),
                      position: new FormControl('', [Validators.required, Validators.minLength(3)]),
                      from_date: new FormControl('', [Validators.required]),
                      to_date: new FormControl('', [Validators.required]),
                      id: new FormControl('')
                    })
                  );
                  this.employment_history.at(index).patchValue({
                    company_name: data?.company_name,
                    position: data?.position,
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
                      qualification_id: new FormControl('', [Validators.required]),
                      completion_year: new FormControl('', [Validators.required]),
                      course: new FormControl('', [Validators.required]),
                      university: new FormControl('', [Validators.required]),
                      id: new FormControl(''),
                    })
                  );
                  this.education_detail.at(index).patchValue({
                    qualification: data?.qualification,
                    qualification_id: data?.qualification_id,
                    completion_year: data?.completion_year,
                    course: data?.course,
                    university: data?.university,
                    id: data?.id
                  });
                })
              }
              break;
            }
            case 'edit-cert': {
              // this.getCandidateData.set(res['data']);
              // if (res['data'].candidate_certifications && res['data'].candidate_certifications.length > 0) {
              //   res['data'].candidate_certifications.map((data: any, index: number) => {
              //     this.certificates.push(
              //       this.fb.group({
              //         name: new FormControl('', [Validators.required]),
              //         validity: new FormControl('', [Validators.required]),
              //         attachment: new FormControl('', [Validators.required]),
              //         id: new FormControl('')
              //       })
              //     );
              //     this.certificates.at(index).patchValue({
              //       name: data?.name,
              //       validity: data?.validity,
              //       attachment: data?.attachment,
              //       id: data?.id
              //     });
              //   })
              // }
              break;
            }
            case 'edit-doc': {
              // if (res['data'].candidate_documents && res['data'].candidate_documents.length > 0) {
              //   // res['data'].candidate_documents.map((data: any, index: number) => {

              //   // })
              // }
              break;
            }
            default: {
              this.addCandidateForm.patchValue({
                name: res['data'].name,
                title: res['data'].title,
                total_experience: res['data'].total_experience,
                relevant_experience: res['data'].relevant_experience,
                email: res['data'].email,
                linkedin: res['data'].linkedin,
                contact: res['data'].contact,
                alternate_contact: res['data'].alternate_contact,
                city: res['data'].city,
                state: res['data'].state,
                zipcode: res['data'].zipcode,
                status: res['data'].status,
                address: res['data'].address,
                address2: res['data'].address2,
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
                resume_source: res['data'].resume_source,
                profile_image: res['data'].profile_image,
                notes: res['data'].notes
              });
              break;
            }
          }
        }
      } else {
        this.toastr.error(res['message'], "");
        this.router.navigate(['dashboard-detail/candidate-detail']);
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

    let reqData = { companyData: this.employment_history.value, account_id: this.account_id(), candidate_id: this.candidateId() };
    console.log('reqData: ', reqData);
    this.communicate.isLoaderLoad.next(true);
    this.api.allPostMethod('candidates/updateCompanyDetails', reqData).subscribe((res: any) => {
      this.communicate.isLoaderLoad.next(false);
      if (res['error'] != true) {
        this.toastr.success("Updated successfully", "")
        this.router.navigate(['dashboard-detail/candidate-detail'])

      } else {
        this.toastr.error(res['message'], "");
      }

    })
  }

  editEducationSubmission() {
    if (this.education_detail.invalid) {
      this.isFieldsValid.set(true);
      return;
    }
    let req = { educationList: this.education_detail.value, account_id: this.account_id(), candidate_id: this.candidateId() };
    console.log('req: ', req);

    this.communicate.isLoaderLoad.next(true);
    this.api.allPostMethod('candidates/updateEducationDetails', req).subscribe((res: any) => {
      this.communicate.isLoaderLoad.next(false);
      if (res['error'] != true) {
        this.toastr.success("Updated successfully", "")
        this.router.navigate(['dashboard-detail/candidate-detail'])
      } else {
        this.toastr.error(res['message'], "");
      }

    })
  }

  editCertificateSubmission() {
    if (this.certificates.invalid) {
      this.isFieldsValid.set(true);
      return;
    }
    let reqData = { certificates: this.certificates.value, account_id: this.account_id(), id: this.candidateId() };
    console.log('reqData: ', reqData);
    this.communicate.isLoaderLoad.next(true);
    this.api.allPostMethod('candidates/addCertificates', reqData).subscribe((res: any) => {
      this.communicate.isLoaderLoad.next(false);
      if (res['error'] != true) {
        this.toastr.success("Updated successfully", "")
        this.router.navigate(['dashboard-detail/candidate-detail'])
      } else {
        this.toastr.error(res['message'], "");
      }

    })
  }

  editDocumentSubmission() {
    if (this.documents.invalid) {
      this.isFieldsValid.set(true);
      return;
    }
    let reqData = { documents: this.documents.value, account_id: this.account_id(), id: this.candidateId() }
    console.log('reqData: ', reqData);
    this.communicate.isLoaderLoad.next(true);
    this.api.allPostMethod('candidates/addResume', reqData).subscribe((res: any) => {
      console.log('res: ', res);
      this.communicate.isLoaderLoad.next(false);
      if (res['error'] != true) {
        this.toastr.success("Updated successfully", "")
        this.router.navigate(['dashboard-detail/candidate-detail'])
      } else {
        this.toastr.error(res['message'], "");
      }

    })
  }

  editCandidate() {
    if (this.addCandidateForm.value.mode_of_hire != 'c2c') {
      this.addCandidateForm.controls['employer_name'].removeValidators(Validators.required);
      this.addCandidateForm.controls['employer_name'].updateValueAndValidity();
    }

    this.addCandidateForm.value.profile_image = this.imgURLBase64();
    if (this.addCandidateForm.invalid) {
      this.isFieldsValid.set(true);
      return;
    }

    let reqData = { ...this.addCandidateForm.value, account_id: this.account_id(), id: this.candidateId() }
    console.log('reqData: ', reqData);
    this.communicate.isLoaderLoad.next(true);
    this.api.allPostMethod('candidates/updateCandidate', reqData).subscribe((res: any) => {
      console.log('res: ', res);
      this.communicate.isLoaderLoad.next(false);
      if (res['error'] != true) {
        this.toastr.success("Updated successfully", "")
        this.router.navigate(['dashboard-detail/candidate-detail'])
      } else {
        this.toastr.error(res['message'], "");
      }

    })

  }

  removePreCertificate(_id: number) {
    this.communicate.isLoaderLoad.next(true);
    this.api.allPostMethod('candidates/deleteCertificates', { account_id: this.account_id(), candidate_id: this.candidateId(), id: _id }).subscribe((res: any) => {
      console.log('res: ', res);
      this.communicate.isLoaderLoad.next(false);
      if (res['error'] != true) {
        this.toastr.success("Deleted successfully", "");
        this.setDataToEdit(this.determineSubmission());
      } else {
        this.toastr.error(res['message'], "");
      }

    })
  }

  getQualificationList() {
    this.communicate.isLoaderLoad.next(true);
    let reqObj = {
      "pageNumber": 1,
      "pageSize": 10,
      "keyword": ""
    }
    this.api.allPostMethod('education-qualification/getlist', reqObj).subscribe((res: any) => {
      this.communicate.isLoaderLoad.next(false);
      if (res['error'] != true) {
        if ((res['data'] && res['data'].length > 0)) {
          if (reqObj.pageNumber == 1) {
            this.qualificationList.set(res['data']);
          } else
            this.qualificationList.update(x => {
              return [...x, ...res['data']]
            })
          // this.totalPages = res['totalPages'];
        } else {
          this.qualificationList.set([]);
        }
      } else {
        this.qualificationList.set([]);
        this.toastr.error(res['message'], "");
      }
    });
  }

  mustBe18Validator(control: FormControl): { [key: string]: boolean } | null {
    const dob = control.value;
    if (dob) {
      const selectedDate = new Date(dob);
      const eighteenYearsAgo = new Date(selectedDate.getTime() + 18 * 365.25 * 24 * 60 * 60 * 1000);
      const today = new Date();

      if (eighteenYearsAgo > today) {
        return { mustBe18: true }; // Return the custom error object
      }
    }
    return null;
  }

  onDOBchange(dob: Date) {
    if (dob) {
      const selectedDate = new Date(dob); // Convert the value to a Date object
      const eighteenYearsAgo = new Date(selectedDate.getTime() + 18 * 365.25 * 24 * 60 * 60 * 1000);
      const today = new Date();
      if (eighteenYearsAgo > today) {
        this.formData['dob'].setErrors({ mustBe18: true }); // Set custom error
      } else {
        // Remove the error if the user selects a valid date
        this.formData['dob'].setErrors(null);
      }
    }
  }

  selectedQualification(event: any, i: any) {
    const filteredItem = this.qualificationList().filter((item: any) => item?.id == event.target.value)
    let control = this.education_detail.at(i) as FormGroup;
    control?.get('qualification')?.setValue(filteredItem[0]?.qualification);
  }

  calculateTotalExperience() {
    let totalMonths = 0;
    this.employment_history.controls.forEach(control => {
      let experience = this.calculateExperience(control.value);
      totalMonths += experience;
    });

    // Calculate total years and remaining months (decimal)
    const totalYears = Math.floor(totalMonths / 12);
    const remainingMonths = totalMonths % 12;
    this.addCandidateForm.get('total_experience')?.setValue(`${totalYears}.${remainingMonths}`)
    // const test = Number(`${totalYears}.${remainingMonths}`)
    // console.log((test))
   

  }

  calculateExperience(entry: any) {
    if (entry.to_date !== '' && entry.from_date !== '') {
      let monthsFrom = 12 - (new Date(entry.from_date).getMonth() + 1);
      let monthsTo = new Date(entry.to_date).getMonth()+1;

      // Adjust months for 'to' date in the same year but before today (optional)
      // if (new Date(entry.to_date).getFullYear() === new Date(entry.from_date).getFullYear() && new Date(entry.to_date) < new Date(entry.from_date)) {
      //   monthsTo = 0;
      // }
      let totalMonths = monthsFrom + monthsTo;
      const years = new Date(entry.to_date).getFullYear() - new Date(entry.from_date).getFullYear();
      // Consider months exceeding a year
      totalMonths += (years-1) * 12;
      return totalMonths;
    }
    else {
      return 0
    }
  }

  triggerExperience(event: any) {
    console.log(event.target.value);
    this.calculateTotalExperience();
  }
}
