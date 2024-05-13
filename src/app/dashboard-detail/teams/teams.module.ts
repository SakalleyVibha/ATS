import { NgModule } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';

import { TeamsRoutingModule } from './teams-routing.module';
import { TeamsComponent } from './teams.component';
import { ManageTeamComponent } from './manage-team/manage-team.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [
    TeamsComponent,
    ManageTeamComponent
  ],
  imports: [
    CommonModule,
    TeamsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    NgOptimizedImage
  ]
})
export class TeamsModule { }
