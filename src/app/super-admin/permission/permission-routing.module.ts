import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PermissionComponent } from './permission.component';
import { ManagePermissionComponent } from './manage-permission/manage-permission.component';

const routes: Routes = [{ path: '', children: [
  { path: '', component: PermissionComponent },
  { path: 'add', component: ManagePermissionComponent },
  { path: 'edit', component: ManagePermissionComponent },
] }
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PermissionRoutingModule { }
