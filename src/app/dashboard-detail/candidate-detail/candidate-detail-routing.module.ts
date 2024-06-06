import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CandidateDetailComponent } from './candidate-detail.component';
import { ManageCandidateComponent } from './manage-candidate/manage-candidate.component';
import { permissionAccessGuard } from '../../core/guards/permission-access.guard';
import { PERMISSIONS } from '../../core/Constants/permissions.constant';

const routes: Routes = [{ path: '', 
children: [
  { path: '', component: CandidateDetailComponent},
   {path: 'add',component: ManageCandidateComponent,canActivate: [permissionAccessGuard],data: { permission: PERMISSIONS.Add_Candidate}},
   {path: 'edit',component: ManageCandidateComponent,canActivate: [permissionAccessGuard],data: { permission: PERMISSIONS.Edit_Candidate}}
] }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CandidateDetailRoutingModule { }
