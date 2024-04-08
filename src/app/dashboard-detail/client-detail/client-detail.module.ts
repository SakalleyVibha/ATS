import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClientDetailRoutingModule } from './client-detail-routing.module';
import { ClientDetailComponent } from './client-detail.component';
import { ManageClientComponent } from './manage-client/manage-client.component';
import { CoreModule } from '../../core/core.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


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
    ClientDetailRoutingModule
  ]
})
export class ClientDetailModule { }
