import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardDetailComponent } from './dashboard-detail.component';
import { DashboardComponent } from './dashboard/dashboard.component';

const routes: Routes = [{
  path: '', component: DashboardDetailComponent, children: [
    { path: '', component: DashboardComponent },
    { path: 'dashboard', component: DashboardComponent },
    { path: 'location-detail', loadChildren: () => import('./location-detail/location-detail.module').then(m => m.LocationDetailModule) },
    { path: 'user-detail', loadChildren: () => import('./user-detail/user-detail.module').then(m => m.UserDetailModule) },
    { path: 'client-detail', loadChildren: () => import('./client-detail/client-detail.module').then(m => m.ClientDetailModule) },
    { path: 'industry', loadChildren: () => import('./industry/industry.module').then(m => m.IndustryModule) },
    { path: 'department', loadChildren: () => import('./department/department.module').then(m => m.DepartmentModule) },
    { path: 'role', loadChildren: () => import('./role/role.module').then(m => m.RoleModule) },
    { path: 'job', loadChildren: () => import('./job/job.module').then(m => m.JobModule) },
    { path: 'team', loadChildren: () => import('./teams/teams.module').then(m => m.TeamsModule) },
    { path: 'skills', loadChildren: () => import('./skills/skills.module').then(m => m.SkillsModule) }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardDetailRoutingModule { }
