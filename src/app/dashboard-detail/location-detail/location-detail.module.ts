import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LocationDetailRoutingModule } from './location-detail-routing.module';
import { LocationDetailComponent } from './location-detail.component';
import { ManageLocationComponent } from './manage-location/manage-location.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CoreModule } from '../../core/core.module';


@NgModule({
  declarations: [
    LocationDetailComponent,
    ManageLocationComponent
  ],
  imports: [
    CoreModule,
    CommonModule,
    LocationDetailRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class LocationDetailModule { }
