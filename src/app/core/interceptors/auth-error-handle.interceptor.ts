import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { catchError, throwError } from 'rxjs';
import { CommunicateService } from '../services/communicate.service';

export const authErrorHandleInterceptor: HttpInterceptorFn = (req, next) => {
  const communicate = inject(CommunicateService);
  const toastr = inject(ToastrService);
  const Route = inject(Router);
  let authToken = localStorage.getItem('token');
  let supertoken = localStorage.getItem('supertoken');
  let permissiontoken = localStorage.getItem('permissiontoken');
  const authReq = req.clone({
    setHeaders: {
      'x-access-token': `${authToken}`,
      'x-access-supertoken': `${supertoken}`,
      'x-access-permissiontoken': `${permissiontoken}`
    }
  });
  return next(authReq).pipe(
    catchError((err: any) => {
      if (err instanceof HttpErrorResponse) {
        if (err.status === 401) {
          console.error('Unauthorized request:', err);
          toastr.error("Token has been expired. Please login again", "", { timeOut: 5000, closeButton: true }).onHidden.subscribe(() => {
            communicate.isLoaderLoad.next(false);
            let url = Route.url;
            let routeTo = url.includes('super-admin') ? 'super-admin/login': '/login';
            Route.navigate([routeTo])
          });
        } else {
          console.error('HTTP error:', err);
        }
      } else {
        console.error('An error occurred:', err);
      }
      return throwError(() => err);
    })
  );
};
