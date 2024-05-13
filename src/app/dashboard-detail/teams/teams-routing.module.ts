import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TeamsComponent } from './teams.component';
import { ManageTeamComponent } from './manage-team/manage-team.component';

const routes: Routes = [{
  path: '', children: [
    { path: '', component: TeamsComponent },
    { path: 'add', component: ManageTeamComponent },
    { path: 'edit', component: ManageTeamComponent }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TeamsRoutingModule { }
