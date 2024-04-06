import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authErrorHandleInterceptor } from './interceptors/auth-error-handle.interceptor';

@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule
  ],
  providers: [
    provideHttpClient(withInterceptors([authErrorHandleInterceptor])),
  ]
})
export class CoreModule { }
