import { NgModule } from '@angular/core';
import { CommonModule, DatePipe, NgOptimizedImage } from '@angular/common';

import { CandidateDetailRoutingModule } from './candidate-detail-routing.module';
import { CandidateDetailComponent } from './candidate-detail.component';
import { ManageCandidateComponent } from './manage-candidate/manage-candidate.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    CandidateDetailComponent,
    ManageCandidateComponent,
  ],
  imports: [
    CommonModule,
    CandidateDetailRoutingModule,
    InfiniteScrollModule,
    FormsModule,
    ReactiveFormsModule,
    NgOptimizedImage
  ],
  providers: [
    DatePipe
  ]
})
export class CandidateDetailModule { }
