import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CreateUserLocationRoutingModule } from './create-user-location-routing.module';
import { CreateUserLocationComponent } from './create-user-location.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CoreModule } from '../core/core.module';
import { LocationDetailModule } from './location-detail/location-detail.module';
import { UserDetailModule } from './user-detail/user-detail.module';

@NgModule({
  declarations: [
    CreateUserLocationComponent,
    SidebarComponent
  ],
  imports: [
    CommonModule,
    CoreModule,
    ReactiveFormsModule,
    FormsModule,
    CreateUserLocationRoutingModule,
    LocationDetailModule,
    UserDetailModule
  ],
})
export class CreateUserLocationModule { }
