import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomFieldFormComponent } from './custom-field-form.component';
import { ManageCustomFieldFormComponent } from './manage-custom-field-form/manage-custom-field-form.component';

const routes: Routes = [{
  path: '', children: [
    { path: '', component: CustomFieldFormComponent},
    { path: 'add', component: ManageCustomFieldFormComponent},
    { path: 'edit', component: ManageCustomFieldFormComponent }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomFieldFormRoutingModule { }
