import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RoleRoutingModule } from './role-routing.module';
import { RoleComponent } from './role.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ManageRoleComponent } from './manage-role/manage-role.component';


@NgModule({
  declarations: [
    RoleComponent,
    ManageRoleComponent
  ],
  imports: [
    CommonModule,
    RoleRoutingModule,
    InfiniteScrollModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class RoleModule { }
