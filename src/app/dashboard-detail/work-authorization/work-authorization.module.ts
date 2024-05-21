import { NgModule } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';

import { WorkAuthorizationRoutingModule } from './work-authorization-routing.module';
import { WorkAuthorizationComponent } from './work-authorization.component';
import { ManageWorkAuthorizationComponent } from './manage-work-authorization/manage-work-authorization.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    WorkAuthorizationComponent,
    ManageWorkAuthorizationComponent
  ],
  imports: [
    CommonModule,
    WorkAuthorizationRoutingModule,
    InfiniteScrollModule,
    FormsModule,
    ReactiveFormsModule,
    NgOptimizedImage
  ]
})
export class WorkAuthorizationModule { }
