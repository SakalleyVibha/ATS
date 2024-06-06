import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { CommunicateService } from '../services/communicate.service';

export const permissionAccessGuard: CanActivateFn = (route, state) => {
  let router:Router = inject(Router);
  let communicate: CommunicateService = inject(CommunicateService)
  let user_data: any = localStorage.getItem('Shared_Data');
  user_data = JSON.parse(user_data);
  let permissiontoken = localStorage.getItem('permissiontoken');
  permissiontoken = communicate.decryptText(permissiontoken)
   let { is_owner = false} = user_data;
   let { permission } = route.data;
   let hasPermission = permissiontoken ? permissiontoken.includes(permission): false;
   if(!is_owner && !hasPermission){
     router.navigate(['dashboard-detail/dashboard']);
     return false
   }

  return true;
};
