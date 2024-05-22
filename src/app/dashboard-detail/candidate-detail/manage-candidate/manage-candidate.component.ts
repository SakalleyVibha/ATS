import { Component, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { EMPLOYER_NAME, MODE_OF_HIRE, PROJECT_STATUS, RELOCATION, RESUME_SOURCE, STATE_CONST, VISA_STATUS } from '../../../core/Constants/list.constant';
import { CommonApiService } from '../../../core/services/common-api.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-manage-candidate',
  templateUrl: './manage-candidate.component.html',
  styleUrl: './manage-candidate.component.css'
})
export class ManageCandidateComponent {

  addCandidateForm!: FormGroup;
  isFieldsValid = signal<boolean>(false);
  showEmployerDD = signal<boolean>(false);
  modeHire = signal<any>(MODE_OF_HIRE);
  state = signal<any>(STATE_CONST);
  relocationList = signal<any>(RELOCATION);
  visaStatus = signal<any>(VISA_STATUS);
  projectStatus = signal<any>(PROJECT_STATUS);
  resumeSource = signal<any>(RESUME_SOURCE);
  employerName = signal<any>(EMPLOYER_NAME);
  imgURLBase64 = signal<any>('');
  selectedFiles: FileList | null = null;
  documentList = signal<any>([]);

  constructor(private fb: FormBuilder, private api: CommonApiService, private toastr: ToastrService) {
    this.createCandidateForm();
  }

  ngOnInit() { }

  get formData() { return this.addCandidateForm.controls };

  createCandidateForm() {
    this.addCandidateForm = this.fb.group({
      account_id: new FormControl(12),
      name: new FormControl('', [Validators.required, Validators.minLength(2)]),
      title: new FormControl('', [Validators.required, Validators.minLength(3)]),
      position: new FormControl('', [Validators.required, Validators.minLength(3)]),
      total_experience: new FormControl('', [Validators.required]),
      relevant_experience: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      linkedin: new FormControl(''),
      contact: new FormControl('', [Validators.required, Validators.minLength(10)]),
      alternate_contact: new FormControl(''),
      city: new FormControl('', [Validators.required]),
      state: new FormControl('', [Validators.required]),
      mode_of_hire: new FormControl('', [Validators.required]),
      visa_status: new FormControl('', [Validators.required]),
      salary_type: new FormControl('', [Validators.required]),
      salary: new FormControl('', [Validators.required]),
      employer_name: new FormControl('', [Validators.required]),
      visa_validity: new FormControl('', [Validators.required]),
      relocation: new FormControl('', [Validators.required]),
      current_project_status: new FormControl('', [Validators.required]),
      joining_availability: new FormControl('', [Validators.required]),
      education_detail: new FormControl('', [Validators.required]),
      graduation_completion_year: new FormControl('', [Validators.required]),
      resume_source: new FormControl('', [Validators.required]),
      logo: new FormControl('', [Validators.required]),
      notes: new FormControl('', [Validators.required])
    });
  }

  convertImageToBase64(file_event: any) {
    new Promise((resolve, reject) => {//changermade

      const reader = new FileReader();
      reader.readAsDataURL(file_event);
      reader.onload = async () => {
        this.imgURLBase64.set(reader.result);
        //changermade
        if (this.imgURLBase64()) {
          resolve(true);
        } else {
          resolve(false);
        }
        //changermade
      };
    })
  }

  async onFileChange(event: any) {//changermade
    if (event.dataTransfer) {
      let file = event.dataTransfer.files
      this.addCandidateForm.controls['logo'].removeValidators(Validators.required);
      this.addCandidateForm.controls['logo'].updateValueAndValidity();
      let bs64Value = await this.convertImageToBase64(file[0]);//changermade
      return
    }
    if (event.srcElement && event.srcElement != undefined) {
      let file = event.srcElement.files
      let bs64Value = await this.convertImageToBase64(file[0]);//changermade
    }
  }

  CrossBtn() {
    this.imgURLBase64.set('');
    this.addCandidateForm.get('logo')?.setValue('');
    this.addCandidateForm.controls['logo'].addValidators(Validators.required);
    this.addCandidateForm.controls['logo'].updateValueAndValidity();
  }

  selectMode(event: any) {
    this.showEmployerDD.set(event.target.value == 'c2c' ? true : false);
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
      const reader = new FileReader();

      reader.onload = (event: any) => {
        base64Files[file.name] = event.target.result.split(',')[1]; // Remove data:application/pdf;base64, prefix
        this.documentList().push({ docType: 'resume', doc: base64Files[file.name] })
      };

      reader.readAsDataURL(file);
    }

    // Handle converted base64 files (e.g., send to server)
    console.log(base64Files);

  }

  saveCandidateForm() {
    if (this.addCandidateForm.invalid) {
      this.isFieldsValid.set(true);

    }
    let req = { ...this.addCandidateForm.value, documents: this.documentList() }
    this.api.allPostMethod("candidates/addCandidate", req).subscribe((res: any) => {
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
}
