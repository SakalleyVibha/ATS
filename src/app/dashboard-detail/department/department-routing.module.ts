import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DepartmentComponent } from './department.component';
import { ManageDepartmentComponent } from './manage-department/manage-department.component';

const routes: Routes = [{ path: '', children:[
  {path:'',component:DepartmentComponent},
  {path:'add',component:ManageDepartmentComponent},
  {path:'edit',component:ManageDepartmentComponent}
] }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DepartmentRoutingModule { }
