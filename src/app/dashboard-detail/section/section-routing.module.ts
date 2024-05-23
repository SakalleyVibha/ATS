import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SectionComponent } from './section.component';
import { ManageSectionComponent } from './manage-section/manage-section.component';

const routes: Routes = [{ path: '',children: [
       {path: '', component: SectionComponent},
      {path: 'add',component: ManageSectionComponent},
      {path: 'edit',component: ManageSectionComponent},
] }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SectionRoutingModule { }
