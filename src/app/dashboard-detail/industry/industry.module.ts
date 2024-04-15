import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IndustryRoutingModule } from './industry-routing.module';
import { IndustryComponent } from './industry.component';
import { ManageIndustryComponent } from './manage-industry/manage-industry.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CoreModule } from '../../core/core.module';


@NgModule({
  declarations: [
    IndustryComponent,
    ManageIndustryComponent
  ],
  imports: [
    CoreModule,
    CommonModule,
    IndustryRoutingModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class IndustryModule { }
