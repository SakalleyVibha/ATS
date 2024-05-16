import { NgModule } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';

import { TeamsRoutingModule } from './teams-routing.module';
import { TeamsComponent } from './teams.component';
import { ManageTeamComponent } from './manage-team/manage-team.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

@NgModule({
  declarations: [
    TeamsComponent,
    ManageTeamComponent
  ],
  imports: [
    CommonModule,
    TeamsRoutingModule,
    FormsModule,
    NgMultiSelectDropDownModule.forRoot(),
    ReactiveFormsModule,
    SharedModule,
    NgOptimizedImage,
    InfiniteScrollModule
  ]
})
export class TeamsModule { }
