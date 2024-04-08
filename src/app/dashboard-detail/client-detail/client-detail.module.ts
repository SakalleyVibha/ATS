import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClientDetailRoutingModule } from './client-detail-routing.module';
import { ClientDetailComponent } from './client-detail.component';
import { ManageClientComponent } from './manage-client/manage-client.component';


@NgModule({
  declarations: [
    ClientDetailComponent,
    ManageClientComponent
  ],
  imports: [
    CommonModule,
    ClientDetailRoutingModule
  ]
})
export class ClientDetailModule { }
