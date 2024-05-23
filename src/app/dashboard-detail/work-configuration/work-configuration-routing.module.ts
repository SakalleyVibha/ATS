import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WorkConfigurationComponent } from './work-configuration.component';
import { ManageWorkConfigurationComponent } from './manage-work-configuration/manage-work-configuration.component';

const routes: Routes = [{
  path: '', children: [
    { path: '', component: WorkConfigurationComponent },
    { path: 'add', component: ManageWorkConfigurationComponent },
    { path: 'edit', component: ManageWorkConfigurationComponent }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WorkConfigurationRoutingModule { }
