import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardDetailComponent } from './dashboard-detail.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { permissionAccessGuard } from '../core/guards/permission-access.guard';
import { PERMISSIONS } from '../core/Constants/permissions.constant';

const routes: Routes = [{
  path: '', component: DashboardDetailComponent, children: [
    { path: '', component: DashboardComponent },
    { path: 'dashboard', component: DashboardComponent },
    { path: 'profile', component: UserProfileComponent },
    { path: 'location-detail', loadChildren: () => import('./location-detail/location-detail.module').then(m => m.LocationDetailModule) },
    { path: 'user-detail', loadChildren: () => import('./user-detail/user-detail.module').then(m => m.UserDetailModule) },
    { path: 'client-detail', loadChildren: () => import('./client-detail/client-detail.module').then(m => m.ClientDetailModule) },
    { path: 'industry', loadChildren: () => import('./industry/industry.module').then(m => m.IndustryModule) },
    { path: 'department', loadChildren: () => import('./department/department.module').then(m => m.DepartmentModule) },
    { path: 'job', loadChildren: () => import('./job/job.module').then(m => m.JobModule) },
    { path: 'team', loadChildren: () => import('./teams/teams.module').then(m => m.TeamsModule) },
    { path: 'skills', loadChildren: () => import('./skills/skills.module').then(m => m.SkillsModule) },
    { path: 'candidate-detail', loadChildren: () => import('./candidate-detail/candidate-detail.module').then(m => m.CandidateDetailModule),canActivate: [permissionAccessGuard], data: { permission: PERMISSIONS.View_Candidate} },
    { path: 'lob-detail', loadChildren: () => import('./lob/lob.module').then(m => m.LobModule) },
    { path: 'job-role', loadChildren: () => import('./job-role/job-role.module').then(m => m.JobRoleModule) },
    { path: 'work-configuration', loadChildren: () => import('./work-configuration/work-configuration.module').then(m => m.WorkConfigurationModule) },
    { path: 'work-authorization', loadChildren: () => import('./work-authorization/work-authorization.module').then(m => m.WorkAuthorizationModule) },
    { path: 'recruits-type', loadChildren: () => import('./recruits-type/recruits-type.module').then(m => m.RecruitsTypeModule) },
    { path: 'employment-type', loadChildren: () => import('./employment-type-form/employment-type-form.module').then(m => m.EmploymentTypeFormModule) },
    { path: 'custom-field', loadChildren: () => import('./custom-field-form/custom-field-form.module').then(m => m.CustomFieldFormModule) },
    { path: 'role', loadChildren: () => import('./role/role.module').then(m => m.RoleModule) },
    { path: 'user-role-permission', loadChildren: () => import('./user-role-permission/user-role-permission.module').then(m => m.UserRolePermissionModule) ,canActivate: [permissionAccessGuard], data: { permission: PERMISSIONS.Read_Write_Pemission}},
  ]
},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardDetailRoutingModule { }
