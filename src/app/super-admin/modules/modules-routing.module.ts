import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ModulesComponent } from './modules.component';
import { ManageModuleComponent } from './manage-module/manage-module.component';

const routes: Routes = [{ path: '', children : [
  { path: '', component: ModulesComponent },
  { path: 'add', component: ManageModuleComponent },
  { path: 'edit', component: ManageModuleComponent },

] }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ModulesRoutingModule { }
