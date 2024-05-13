import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SkillsComponent } from './skills.component';
import { ManageSkillsComponent } from './manage-skills/manage-skills.component';

const routes: Routes = [{ path: '', children:[
  {path:'',component:SkillsComponent},
  {path:'add',component:ManageSkillsComponent},
  {path:'edit',component:ManageSkillsComponent},
] }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SkillsRoutingModule { }
