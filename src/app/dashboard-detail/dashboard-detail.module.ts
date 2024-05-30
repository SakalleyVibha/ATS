import { NgModule } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';

import { DashboardDetailRoutingModule } from './dashboard-detail-routing.module';
import { DashboardDetailComponent } from './dashboard-detail.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CoreModule } from '../core/core.module';
import { SidebarComponent } from './sidebar/sidebar.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authErrorHandleInterceptor } from '../core/interceptors/auth-error-handle.interceptor';

@NgModule({
  declarations: [
    DashboardDetailComponent,
    DashboardComponent,
    SidebarComponent,
    UserProfileComponent
  ],
  imports: [
    CommonModule,
    DashboardDetailRoutingModule,
    CoreModule,
    ReactiveFormsModule,
    NgMultiSelectDropDownModule.forRoot(),
    FormsModule,
    NgOptimizedImage
  ],
  providers: [
    provideHttpClient(withInterceptors([authErrorHandleInterceptor])),
  ]
})
export class DashboardDetailModule { }
