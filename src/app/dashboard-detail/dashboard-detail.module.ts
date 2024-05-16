import { NgModule } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';

import { DashboardDetailRoutingModule } from './dashboard-detail-routing.module';
import { DashboardDetailComponent } from './dashboard-detail.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CoreModule } from '../core/core.module';
import { SidebarComponent } from './sidebar/sidebar.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';


@NgModule({
  declarations: [
    DashboardDetailComponent,
    DashboardComponent,
    SidebarComponent
  ],
  imports: [
    CommonModule,
    DashboardDetailRoutingModule,
    CoreModule,
    ReactiveFormsModule,
    NgMultiSelectDropDownModule.forRoot(),
    FormsModule,
    NgOptimizedImage
  ]
})
export class DashboardDetailModule { }
