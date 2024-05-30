import { CanActivateFn, Router } from '@angular/router';
import { CommonApiService } from '../../core/services/common-api.service';
import { inject } from '@angular/core';

export const superAdminGuard: CanActivateFn = (route, state) => {
  const AuthService = inject(CommonApiService);
  const Route = inject(Router);
  if (AuthService.isSuperAdminLoggedIn()) {
    return true;
  }
  Route.navigate(['super-admin/login']);
  return false;
};
