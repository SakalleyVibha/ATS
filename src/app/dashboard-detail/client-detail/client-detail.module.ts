import { NgModule } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

import { ClientDetailRoutingModule } from './client-detail-routing.module';
import { ClientDetailComponent } from './client-detail.component';
import { ManageClientComponent } from './manage-client/manage-client.component';
import { CoreModule } from '../../core/core.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';


@NgModule({
  declarations: [
    ClientDetailComponent,
    ManageClientComponent
  ],
  imports: [
    CoreModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    ClientDetailRoutingModule,
    InfiniteScrollModule,
    SharedModule,
    NgOptimizedImage
  ]
})
export class ClientDetailModule { }
