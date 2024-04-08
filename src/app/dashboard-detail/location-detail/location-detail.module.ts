import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LocationDetailRoutingModule } from './location-detail-routing.module';
import { LocationDetailComponent } from './location-detail.component';
import { ManageLocationComponent } from './manage-location/manage-location.component';


@NgModule({
  declarations: [
    LocationDetailComponent,
    ManageLocationComponent
  ],
  imports: [
    CommonModule,
    LocationDetailRoutingModule
  ]
})
export class LocationDetailModule { }
