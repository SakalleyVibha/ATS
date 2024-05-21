import { NgModule } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';

import { WorkConfigurationRoutingModule } from './work-configuration-routing.module';
import { WorkConfigurationComponent } from './work-configuration.component';
import { ManageWorkConfigurationComponent } from './manage-work-configuration/manage-work-configuration.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    WorkConfigurationComponent,
    ManageWorkConfigurationComponent
  ],
  imports: [
    CommonModule,
    WorkConfigurationRoutingModule,
    InfiniteScrollModule,
    FormsModule,
    ReactiveFormsModule,
    NgOptimizedImage
  ]
})
export class WorkConfigurationModule { }
