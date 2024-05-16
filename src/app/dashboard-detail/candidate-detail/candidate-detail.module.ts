import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CandidateDetailRoutingModule } from './candidate-detail-routing.module';
import { CandidateDetailComponent } from './candidate-detail.component';
import { ManageCandidateComponent } from './manage-candidate/manage-candidate.component';


@NgModule({
  declarations: [
    CandidateDetailComponent,
    ManageCandidateComponent,
  ],
  imports: [
    CommonModule,
    CandidateDetailRoutingModule
  ]
})
export class CandidateDetailModule { }
