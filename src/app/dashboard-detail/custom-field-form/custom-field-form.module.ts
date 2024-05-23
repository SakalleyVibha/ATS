import { NgModule } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';

import { CustomFieldFormRoutingModule } from './custom-field-form-routing.module';
import { CustomFieldFormComponent } from './custom-field-form.component';
import { ManageCustomFieldFormComponent } from './manage-custom-field-form/manage-custom-field-form.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    CustomFieldFormComponent,
    ManageCustomFieldFormComponent
  ],
  imports: [
    CommonModule,
    CustomFieldFormRoutingModule,
    InfiniteScrollModule,
    FormsModule,
    ReactiveFormsModule,
    NgOptimizedImage
  ]
})
export class CustomFieldFormModule { }
