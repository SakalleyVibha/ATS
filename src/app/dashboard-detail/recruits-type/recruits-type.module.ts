import { NgModule } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';

import { RecruitsTypeRoutingModule } from './recruits-type-routing.module';
import { RecruitsTypeComponent } from './recruits-type.component';
import { ManageRecruitsTypeComponent } from './manage-recruits-type/manage-recruits-type.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    RecruitsTypeComponent,
    ManageRecruitsTypeComponent
  ],
  imports: [
    CommonModule,
    RecruitsTypeRoutingModule,
    InfiniteScrollModule,
    FormsModule,
    ReactiveFormsModule,
    NgOptimizedImage
  ]
})
export class RecruitsTypeModule { }
