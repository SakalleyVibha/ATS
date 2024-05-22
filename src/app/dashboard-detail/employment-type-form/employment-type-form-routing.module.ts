import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmploymentTypeFormComponent } from './employment-type-form.component';
import { ManageEmploymentTypeFormComponent } from './manage-employment-type-form/manage-employment-type-form.component';

const routes: Routes = [{
  path: '', children: [
    { path: '', component: EmploymentTypeFormComponent },
    { path: 'add', component: ManageEmploymentTypeFormComponent},
    { path: 'edit', component: ManageEmploymentTypeFormComponent }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmploymentTypeFormRoutingModule { }
