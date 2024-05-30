import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SuperAdminRoutingModule } from './super-admin-routing.module';
import { SuperAdminComponent } from './super-admin.component';
import { LoginComponent } from './login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SidebarComponent } from './sidebar/sidebar.component';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { superAdminInterceptor } from './interceptor/super-admin.interceptor';


@NgModule({
  declarations: [
    SuperAdminComponent,
    LoginComponent,
    SidebarComponent,
  ],
  imports: [
    CommonModule,
    SuperAdminRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    provideHttpClient(withInterceptors([superAdminInterceptor])),
  ]
})
export class SuperAdminModule { }
