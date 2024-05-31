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
  const authReq = req.clone({
    setHeaders: {
      'x-access-token': `${authToken}`,
      'x-access-supertoken': `${supertoken}`
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
