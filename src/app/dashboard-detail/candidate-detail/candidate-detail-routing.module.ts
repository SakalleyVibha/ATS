import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CandidateDetailComponent } from './candidate-detail.component';
import { ManageCandidateComponent } from './manage-candidate/manage-candidate.component';

const routes: Routes = [{ path: '', 
children: [
  { path: '', component: CandidateDetailComponent},
   {path: 'add',component: ManageCandidateComponent},
   {path: 'edit',component: ManageCandidateComponent}
] }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CandidateDetailRoutingModule { }
