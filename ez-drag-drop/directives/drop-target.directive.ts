import {
  Directive,
  ElementRef,
  HostListener,
  Input,
  Renderer2,
} from "@angular/core";
import { DropTargetBase } from "../models/drop-target-base";
import { DraggingService } from "../services/dragging.service";

@Directive({
  selector: "[ezDropTarget]",
})
export class DropTargetDirective {
  @Input("ezDropTarget") dropTarget!: DropTargetBase;
  // tslint:disable-next-line:no-input-rename
  @Input("ezDragOverStyle") dragOverStyles: string[] = ["ez-drag-over"];
  // tslint:disable-next-line:no-input-rename
  @Input("ezCanDropStyle") canDropStyles: string[] = ["ez-can-drop"];
  // tslint:disable-next-line:no-input-rename
  @Input("ezCanNotDropStyle") canNotDropStyles: string[] = ["ez-can-not-drop"];

  private _appliedStyles: string[] = [];

  constructor(
    private elementRef: ElementRef,
    private renderer: Renderer2,
    private draggingService: DraggingService
  ) {}

  @HostListener("dragover", ["$event"]) onDragOver(e: DragEvent): void {
    if (this.draggingService.activeDraggable) {
      this.addDragOverStyles();
      if (this.draggingService.canDrop(this.dropTarget)) {
        this.addCanDropStyles();
        e.preventDefault();
        e.stopPropagation();
      } else {
        this.addCanNotDropStyles();
      }
    }
  }

  @HostListener("dragleave", ["$event"]) onDragLeave(e: DragEvent): void {
    this.removeDragOverStyles();
  }

  @HostListener("drop", ["$event"]) onDrop(e: DragEvent): void {
    this.draggingService.drop(this.dropTarget);
    this.removeAllAppliedClassesFromElement();
  }

  private addClassToElement(style: string): void {
    this.renderer.addClass(this.elementRef.nativeElement, style);
    this._appliedStyles.push(style);
  }

  private removeClassFromElement(style: string): void {
    this.renderer.removeClass(this.elementRef.nativeElement, style);

    const indexToRemove = this._appliedStyles.indexOf(style);
    if (indexToRemove !== -1) {
      this._appliedStyles.splice(indexToRemove, 1);
    }
  }

  private removeAllAppliedClassesFromElement(): void {
    const appliedStyles = this._appliedStyles.slice();
    for (const style of appliedStyles) {
      this.removeClassFromElement(style);
    }
  }

  private addDragOverStyles(): void {
    for (const dragOverStyle of this.dragOverStyles) {
      this.addClassToElement(dragOverStyle);
    }
  }

  private removeDragOverStyles(): void {
    for (const dragOverStyle of this.dragOverStyles) {
      this.removeClassFromElement(dragOverStyle);
    }
  }

  private addCanDropStyles(): void {
    for (const canDropStyle of this.canDropStyles) {
      this.addClassToElement(canDropStyle);
    }
  }

  private addCanNotDropStyles(): void {
    for (const canNotDropStyle of this.canNotDropStyles) {
      this.addClassToElement(canNotDropStyle);
    }
  }
}
