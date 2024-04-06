import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CreateUserLocationRoutingModule } from './create-user-location-routing.module';
import { CreateUserLocationComponent } from './create-user-location.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { UserDetailComponent } from '../user-detail/user-detail.component';
import { LocationDetailComponent } from '../location-detail/location-detail.component';

@NgModule({
  declarations: [
    CreateUserLocationComponent,
    SidebarComponent,
    UserDetailComponent,
    LocationDetailComponent
  ],
  imports: [
    CommonModule,
    CreateUserLocationRoutingModule
  ]
})
export class CreateUserLocationModule { }
