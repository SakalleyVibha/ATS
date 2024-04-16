import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RoleRoutingModule } from './role-routing.module';
import { RoleComponent } from './role.component';
import { ManageRoleComponent } from './manage-role/manage-role.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';


@NgModule({
  declarations: [
    RoleComponent,
    ManageRoleComponent
  ],
  imports: [
    CommonModule,
    RoleRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    InfiniteScrollModule
  ]
})
export class RoleModule { }
