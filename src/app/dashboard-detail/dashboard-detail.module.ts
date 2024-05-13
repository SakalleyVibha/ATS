import { NgModule } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';

import { DashboardDetailRoutingModule } from './dashboard-detail-routing.module';
import { DashboardDetailComponent } from './dashboard-detail.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CoreModule } from '../core/core.module';


@NgModule({
  declarations: [
    DashboardDetailComponent,
    DashboardComponent,
  ],
  imports: [
    CommonModule,
    CoreModule,
    ReactiveFormsModule,
    FormsModule,
    DashboardDetailRoutingModule,
    NgOptimizedImage
  ]
})
export class DashboardDetailModule { }
