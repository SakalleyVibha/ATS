import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { VerifyEmailComponent } from './verify-email/verify-email.component';
import { CreateOrganizationComponent } from './create-organization/create-organization.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'verify-email', component: VerifyEmailComponent },
  { path: 'create-organization', component: CreateOrganizationComponent },
  { path: 'create-user-location', loadChildren: () => import('./create-user-location/create-user-location.module').then(m => m.CreateUserLocationModule) },
  { path: 'dashboard-detail', loadChildren: () => import('./dashboard-detail/dashboard-detail.module').then(m => m.DashboardDetailModule) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
