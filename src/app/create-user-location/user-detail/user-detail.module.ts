import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserDetailRoutingModule } from './user-detail-routing.module';
import { UserDetailComponent } from './user-detail.component';
import { ManageUserComponent } from './manage-user/manage-user.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    UserDetailComponent,
    ManageUserComponent
  ],
  imports: [
    CommonModule,
    UserDetailRoutingModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class UserDetailModule { }
