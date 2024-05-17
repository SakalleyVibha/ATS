import { NgModule } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';

import { LobRoutingModule } from './lob-routing.module';
import { LobComponent } from './lob.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ManageLobComponent } from './manage-lob/manage-lob.component';


@NgModule({
  declarations: [
    LobComponent,
    ManageLobComponent
  ],
  imports: [
    CommonModule,
    LobRoutingModule,
    InfiniteScrollModule,
    FormsModule,
    ReactiveFormsModule,
    NgOptimizedImage
  ]
})
export class LobModule { }
