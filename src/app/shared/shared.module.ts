import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileDragNDropDirective } from './file-drag-n-drop.directive';

@NgModule({
  declarations: [FileDragNDropDirective],
  imports: [
    CommonModule
  ],
  exports:[FileDragNDropDirective]
})
export class SharedModule { }
