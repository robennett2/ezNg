import { Directive, ElementRef, HostListener, Input, Renderer2 } from '@angular/core';
import { DropTargetBase } from '../models/drop-target-base';
import { DraggingService } from '../services/dragging.service';

@Directive({
  selector: '[ezDropTarget]'
})
export class DropTargetDirective {
  @Input("ezDropTarget") dropTarget !: DropTargetBase;
  @Input("ezDragOverStyle") dragOverStyles : string[] = ["ez-drag-over"];
  @Input("ezCanDropStyle") canDropStyles : string[] = ["ez-can-drop"];
  @Input("ezCanNotDropStyle") canNotDropStyles : string[] = ["ez-can-not-drop"];

  private _appliedStyles : string[] = [];

  constructor(private elementRef : ElementRef, private renderer : Renderer2, private draggingService : DraggingService) { }

  @HostListener("dragover", ['$event']) onDragOver(e : DragEvent) {
    this.addDragOverStyles();
    if (this.draggingService.canDrop(this.dropTarget)) {
      this.addCanDropStyles();
      e.preventDefault();
      e.stopPropagation();
    } else {
      this.addCanNotDropStyles();
    }
  }

  @HostListener("drop", ['$event']) onDrop(e : DragEvent) {
    this.draggingService.drop(this.dropTarget);
    this.removeAllAppliedClassesFromElement();
  }

  private addClassToElement(style : string) {
    this.renderer.addClass(this.elementRef.nativeElement, style);
    this._appliedStyles.push(style);
  }

  private removeClassFromElement(style : string) {
    this.renderer.removeClass(this.elementRef.nativeElement, style);

    const indexToRemove = this._appliedStyles.indexOf(style);
    if (indexToRemove !== -1)
      this._appliedStyles.splice(indexToRemove, 1);
  }

  private removeAllAppliedClassesFromElement() {
    const appliedStyles = [...this._appliedStyles]; // Copy the array so we aren't iterating and modifying it
    for (const style of appliedStyles) {
      console.log(this._appliedStyles, style);
      this.removeClassFromElement(style);
    }
  }

  private addDragOverStyles() {
    for (const dragOverStyle of this.dragOverStyles)
      this.addClassToElement(dragOverStyle);
  }

  private addCanDropStyles() {
    for (const canDropStyle of this.canDropStyles)
    this.addClassToElement(canDropStyle);
  }

  private addCanNotDropStyles() {
    for (const canNotDropStyle of this.canNotDropStyles)
      this.addClassToElement(canNotDropStyle);
  }
}
