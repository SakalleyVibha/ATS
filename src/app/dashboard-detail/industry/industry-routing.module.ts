import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IndustryComponent } from './industry.component';
import { ManageIndustryComponent } from './manage-industry/manage-industry.component';

const routes: Routes = [{ path: '', children:[
  {path:'',component:IndustryComponent},
  {path:'add',component:ManageIndustryComponent},
  {path:'edit',component:ManageIndustryComponent}
  ] 
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IndustryRoutingModule { }
