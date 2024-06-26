import { NgModule } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';

import { LocationDetailRoutingModule } from './location-detail-routing.module';
import { LocationDetailComponent } from './location-detail.component';
import { ManageLocationComponent } from './manage-location/manage-location.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CoreModule } from '../../core/core.module';
import { InfiniteScrollModule } from "ngx-infinite-scroll";
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [
    LocationDetailComponent,
    ManageLocationComponent,
  ],
  imports: [
    CoreModule,
    CommonModule,
    LocationDetailRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    InfiniteScrollModule,
    SharedModule,
    NgOptimizedImage
  ]
})
export class LocationDetailModule { }
