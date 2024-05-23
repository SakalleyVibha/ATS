import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SectionRoutingModule } from './section-routing.module';
import { SectionComponent } from './section.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { ManageSectionComponent } from './manage-section/manage-section.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    SectionComponent,
    ManageSectionComponent
  ],
  imports: [
    CommonModule,
    SectionRoutingModule,
    InfiniteScrollModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class SectionModule { }
