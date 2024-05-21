import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RecruitsTypeComponent } from './recruits-type.component';
import { ManageRecruitsTypeComponent } from './manage-recruits-type/manage-recruits-type.component';

const routes: Routes = [{
  path: '', children: [
    { path: '', component: RecruitsTypeComponent },
    { path: 'add', component: ManageRecruitsTypeComponent},
    { path: 'edit', component: ManageRecruitsTypeComponent }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RecruitsTypeRoutingModule { }
