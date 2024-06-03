import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RolePermissionRoutingModule } from './role-permission-routing.module';
import { RolePermissionComponent } from './role-permission.component';
import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';


@NgModule({
  declarations: [
    RolePermissionComponent
  ],
  imports: [
    CommonModule,
    RolePermissionRoutingModule,
    NgbPopoverModule
  ]
})
export class RolePermissionModule { }
