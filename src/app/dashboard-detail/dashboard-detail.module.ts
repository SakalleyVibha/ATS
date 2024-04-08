import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardDetailRoutingModule } from './dashboard-detail-routing.module';
import { DashboardDetailComponent } from './dashboard-detail.component';
import { DashboardComponent } from './dashboard/dashboard.component';


@NgModule({
  declarations: [
    DashboardDetailComponent,
    DashboardComponent
  ],
  imports: [
    CommonModule,
    DashboardDetailRoutingModule
  ]
})
export class DashboardDetailModule { }
