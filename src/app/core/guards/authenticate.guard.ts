import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { CommonApiService } from '../services/common-api.service';

export const authenticateGuard: CanActivateFn = (route, state) => {
  const AuthService = inject(CommonApiService);
  const Route = inject(Router);
  if (AuthService.isLoggedIn()) {
    return true
  }
  return Route.navigate(['/login']);
};
