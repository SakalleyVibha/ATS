import { NgModule } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';

import { EmploymentTypeFormRoutingModule } from './employment-type-form-routing.module';
import { EmploymentTypeFormComponent } from './employment-type-form.component';
import { ManageEmploymentTypeFormComponent } from './manage-employment-type-form/manage-employment-type-form.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    EmploymentTypeFormComponent,
    ManageEmploymentTypeFormComponent
  ],
  imports: [
    CommonModule,
    EmploymentTypeFormRoutingModule,
    InfiniteScrollModule,
    FormsModule,
    ReactiveFormsModule,
    NgOptimizedImage
  ]
})
export class EmploymentTypeFormModule { }
