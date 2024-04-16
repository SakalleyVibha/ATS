import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { JobComponent } from './job.component';
import { ManageJobComponent } from './manage-job/manage-job.component';

const routes: Routes = [{
  path: '', children: [
    { path: '', component: JobComponent },
    { path: 'add', component: ManageJobComponent },
    { path: 'edit', component: ManageJobComponent }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JobRoutingModule { }
