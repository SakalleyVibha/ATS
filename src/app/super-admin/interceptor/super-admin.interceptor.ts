import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { CommunicateService } from '../../core/services/communicate.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';

export const superAdminInterceptor: HttpInterceptorFn = (req, next) => {
  let token = localStorage.getItem('supertoken');
  const communicate = inject(CommunicateService);
  const toastr = inject(ToastrService);
  const Route = inject(Router);
  let authToken = localStorage.getItem('token');
  const authReq = req.clone({
    setHeaders: {
      'x-access-token': `${token}`
    }
  });
  return next(authReq).pipe(
    catchError((err: any) => {
      if (err instanceof HttpErrorResponse) {
        if (err.status === 401) {
          console.error('Unauthorized request:', err);
          communicate.isLoaderLoad.next(false);
          toastr.error("Token has been expired. Please login again", "", { timeOut: 5000, closeButton: true }).onHidden.subscribe(() => {
            Route.navigate(['/login'])
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
