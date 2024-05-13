import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SkillsRoutingModule } from './skills-routing.module';
import { SkillsComponent } from './skills.component';
import { ManageSkillsComponent } from './manage-skills/manage-skills.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    SkillsComponent,
    ManageSkillsComponent
  ],
  imports: [
    CommonModule,
    SkillsRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class SkillsModule { }
