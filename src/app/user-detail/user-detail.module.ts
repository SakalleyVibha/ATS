import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserDetailRoutingModule } from './user-detail-routing.module';
import { UserDetailComponent } from './user-detail.component';
import { ManageUserComponent } from './manage-user/manage-user.component';


@NgModule({
  declarations: [
    UserDetailComponent,
    ManageUserComponent
  ],
  imports: [
    CommonModule,
    UserDetailRoutingModule
  ]
})
export class UserDetailModule { }
