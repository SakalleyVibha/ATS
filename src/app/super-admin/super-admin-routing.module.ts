import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SuperAdminComponent } from './super-admin.component';
import { LoginComponent } from './login/login.component';
import { superAdminGuard } from './guards/super-admin.guard';

const routes: Routes = [{ path: '', component: SuperAdminComponent,children:[
     {path: '',redirectTo:'dashboard',pathMatch: 'full'},
     {path: 'login',component: LoginComponent},
     { path: 'dashboard', loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule),canActivate: [superAdminGuard] },
     { path: 'permission', loadChildren: () => import('./permission/permission.module').then(m => m.PermissionModule),canActivate: [superAdminGuard] },
     { path: 'modules', loadChildren: () => import('./modules/modules.module').then(m => m.ModulesModule),canActivate: [superAdminGuard] },
     { path: 'section', loadChildren: () => import('./section/section.module').then(m => m.SectionModule),canActivate: [superAdminGuard] },
     { path: 'role-permission', loadChildren: () => import('./role-permission/role-permission.module').then(m => m.RolePermissionModule),canActivate: [superAdminGuard] },
     { path: 'role', loadChildren: () => import('./role/role.module').then(m => m.RoleModule),canActivate: [superAdminGuard] },
] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SuperAdminRoutingModule { }
