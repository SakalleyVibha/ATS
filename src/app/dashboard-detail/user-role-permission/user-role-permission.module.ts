import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRolePermissionRoutingModule } from './user-role-permission-routing.module';
import { UserRolePermissionComponent } from './user-role-permission.component';
import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';


@NgModule({
  declarations: [
    UserRolePermissionComponent
  ],
  imports: [
    CommonModule,
    UserRolePermissionRoutingModule,
    NgbPopoverModule
  ]
})
export class UserRolePermissionModule { }
