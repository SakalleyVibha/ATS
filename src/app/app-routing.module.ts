import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { VerifyEmailComponent } from './verify-email/verify-email.component';
import { CreateOrganizationComponent } from './create-organization/create-organization.component';
import { PasswordChangeComponent } from './password-change/password-change.component';
import { authenticateGuard } from './core/guards/authenticate.guard';

const routes: Routes = [
  { path: '', redirectTo: 'dashboard-detail', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'password-change', component: PasswordChangeComponent },
  { path: 'verify-email', component: VerifyEmailComponent },
  { path: 'create-organization', component: CreateOrganizationComponent, canActivate: [authenticateGuard] },
  { path: 'dashboard-detail', loadChildren: () => import('./dashboard-detail/dashboard-detail.module').then(m => m.DashboardDetailModule), canActivate: [authenticateGuard] },
  { path: 'super-admin', loadChildren: () => import('./super-admin/super-admin.module').then(m => m.SuperAdminModule) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
