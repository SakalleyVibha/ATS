import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { JobRoutingModule } from './job-routing.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { JobComponent } from './job.component';
import { ManageJobComponent } from './manage-job/manage-job.component';


@NgModule({
  declarations: [
    JobComponent,
    ManageJobComponent
  ],
  imports: [
    CommonModule,
    JobRoutingModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class JobModule { }
