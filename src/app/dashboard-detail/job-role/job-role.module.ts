import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { JobRoleRoutingModule } from './job-role-routing.module';
import { JobRoleComponent } from './job-role.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { ManageJobRoleComponent } from './manage-job-role/manage-job-role.component';


@NgModule({
  declarations: [
    JobRoleComponent,
    ManageJobRoleComponent
  ],
  imports: [
    CommonModule,
    JobRoleRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    InfiniteScrollModule
  ]
})
export class JobRoleModule { }
