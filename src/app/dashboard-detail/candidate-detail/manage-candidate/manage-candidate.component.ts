import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-manage-candidate',
  templateUrl: './manage-candidate.component.html',
  styleUrl: './manage-candidate.component.css'
})
export class ManageCandidateComponent {

  // addCandidateForm: FormGroup;

  constructor(private fb: FormBuilder) {
    //     this.addCandidateForm = this.fb.group({
    //       name : new FormControl('', [Validators.required]),
    //       city: new FormControl('', [Validators.required]),
    //       state : new FormControl('', [Validators.required]),
    //       contact : new FormControl('', [Validators.required]),
    //       alt_contact : new FormControl('', [Validators.required]),
    //       email_address : new FormControl('', [Validators.required]),
    //       linkedin_id: new FormControl('', [Validators.required]),
    //       modeOfHire: new FormControl('', [Validators.required]),
    //       visa_status : new FormControl('', [Validators.required]),
    //       employer_name : new FormControl('', [Validators.required]),
    // Employer Name		Form Field
    // Visa Validity		Date Field
    // Hourly Rate / Salary	Mandatory	Form Field
    // Total Experience	Mandatory	Drop Down
    // Relevant Experience	Mandatory	Drop Down
    // Relocation/Travel	Mandatory	Drop Down
    // Current Project Status	Mandatory	Drop Down
    // Joining Availability	Mandatory	Form Field
    // Education Details	Mandatory	Form Field
    // Graduation Completion Year	Mandatory	Form Field
    // Resume Source	Mandatory	Drop Down
    // Notes (Summary / Portfolio Link)		Form Field
    //     })
  }

  ngOnInit() { }
}
