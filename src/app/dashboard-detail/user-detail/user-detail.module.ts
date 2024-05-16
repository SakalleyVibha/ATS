import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CoreModule } from '../../core/core.module';

import { UserDetailRoutingModule } from './user-detail-routing.module';
import { UserDetailComponent } from './user-detail.component';
import { ManageUserComponent } from './manage-user/manage-user.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';


@NgModule({
  declarations: [
    UserDetailComponent,
    ManageUserComponent
  ],
  imports: [
    CommonModule,
    UserDetailRoutingModule,
    NgMultiSelectDropDownModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    CoreModule,
    InfiniteScrollModule
  ]
})
export class UserDetailModule { }
