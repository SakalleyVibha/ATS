import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LocationDetailRoutingModule } from './location-detail-routing.module';
import { LocationDetailComponent } from './location-detail.component';


@NgModule({
  declarations: [
    LocationDetailComponent
  ],
  imports: [
    CommonModule,
    LocationDetailRoutingModule
  ]
})
export class LocationDetailModule { }
