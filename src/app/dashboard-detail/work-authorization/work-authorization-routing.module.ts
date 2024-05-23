import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WorkAuthorizationComponent } from './work-authorization.component';
import { ManageWorkAuthorizationComponent } from './manage-work-authorization/manage-work-authorization.component';

const routes: Routes = [{
  path: '', children: [
    { path: '', component: WorkAuthorizationComponent },
    { path: 'add', component: ManageWorkAuthorizationComponent},
    { path: 'edit', component: ManageWorkAuthorizationComponent }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WorkAuthorizationRoutingModule { }
