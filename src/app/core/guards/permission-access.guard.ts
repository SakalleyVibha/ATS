import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const permissionAccessGuard: CanActivateFn = (route, state) => {
  let router:Router = inject(Router)
  let user_data: any = localStorage.getItem('Shared_Data');
   user_data = JSON.parse(user_data);
   let { is_owner = false} = user_data;
   let { permission } = route.data;
   let hasPermission = user_data.permissions ? user_data.permissions.includes(permission): false;
   if(!is_owner && !hasPermission){
     router.navigate(['dashboard-detail/dashboard']);
     return false
   }

  return true;
};
