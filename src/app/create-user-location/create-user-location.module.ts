import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CreateUserLocationRoutingModule } from './create-user-location-routing.module';
import { CreateUserLocationComponent } from './create-user-location.component';
import { SidebarComponent } from './sidebar/sidebar.component';


@NgModule({
  declarations: [
    CreateUserLocationComponent,
    SidebarComponent
  ],
  imports: [
    CommonModule,
    CreateUserLocationRoutingModule
  ]
})
export class CreateUserLocationModule { }
