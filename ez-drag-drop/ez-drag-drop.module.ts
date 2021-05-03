import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DraggableDirective } from './directives/draggable.directive';
import { DropTargetDirective } from './directives/drop-target.directive';
@NgModule({
  declarations: [DraggableDirective, DropTargetDirective],
  exports:[DropTargetDirective, DraggableDirective],
  imports: [
    CommonModule
  ]
})
export class EzDragDropModule { }
