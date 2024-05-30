import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoleComponent } from './role.component';
import { ManageRoleComponent } from './manage-role/manage-role.component';

const routes: Routes = [{ path: '', children: [
  { path: '', component: RoleComponent },
  { path : 'add', component: ManageRoleComponent},
  { path : 'edit', component: ManageRoleComponent},
] }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RoleRoutingModule { }
