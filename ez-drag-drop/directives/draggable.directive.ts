import { Directive, ElementRef, HostListener, Input, OnInit, Renderer2 } from '@angular/core';
import { DraggableBase } from '../models/draggable-base';
import { DraggingService } from '../services/dragging.service';

@Directive({
  selector: '[ezDraggable]'
})
export class DraggableDirective implements OnInit {
  @Input("ezDraggable") draggable !: DraggableBase;
  @Input("ezDraggingStyles") draggingStyles : string[] = ['ez-dragging'];
  private _appliedStyles : string[] = [];

  constructor(private elementRef : ElementRef, private renderer : Renderer2, private draggingService : DraggingService) { }

  @HostListener("dragstart", ['$event']) onDragStart(e : DragEvent) {
    this.draggingService.startDragging(this.draggable);
    this.addDraggingStyles();
  }

  @HostListener("dragend", ['$event']) onDragEnd(e : DragEvent) {
    this.draggingService.stopDragging();
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

  private addDraggingStyles() {
    for (const draggingStyle of this.draggingStyles)
      this.addClassToElement(draggingStyle);
  }

  ngOnInit(): void {
    this.renderer.setAttribute(this.elementRef.nativeElement, "draggable", "true");
  }
}
