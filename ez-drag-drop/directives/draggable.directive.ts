import {
  Directive,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
  Renderer2,
} from "@angular/core";
import { Subject } from "rxjs";
import { filter, map, takeUntil } from "rxjs/operators";
import { DraggableBase } from "../models/draggable-base";
import { DropTargetBase } from "../models/drop-target-base";
import { DraggingService } from "../services/dragging.service";

@Directive({
  selector: "[ezDraggable]",
})
export class DraggableDirective implements OnInit {
  @Input("ezDraggable") draggable!: DraggableBase;
  // tslint:disable-next-line:no-input-rename
  @Input("ezDraggingStyles") draggingStyles: string[] = ["ez-dragging"];
  @Output("ezDropped")
  droppedEvent = new EventEmitter<DropTargetBase>();

  private _appliedStyles: string[] = [];
  private onDestroyedSubject!: Subject<void>;

  constructor(
    private elementRef: ElementRef,
    private renderer: Renderer2,
    private draggingService: DraggingService
  ) {}

  @HostListener("dragstart", ["$event"]) onDragStart(e: DragEvent): void {
    this.draggingService.startDragging(this.draggable);
    this.addDraggingStyles();
    e.stopPropagation();
  }

  @HostListener("dragend", ["$event"]) onDragEnd(e: DragEvent): void {
    this.draggingService.stopDragging();
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
    const appliedStyles = [...this._appliedStyles]; // Copy the array so we aren't iterating and modifying it
    for (const style of appliedStyles) {
      this.removeClassFromElement(style);
    }
  }

  private addDraggingStyles(): void {
    for (const draggingStyle of this.draggingStyles) {
      this.addClassToElement(draggingStyle);
    }
  }

  ngOnInit(): void {
    this.onDestroyedSubject = new Subject<void>();

    this.renderer.setAttribute(
      this.elementRef.nativeElement,
      "draggable",
      "true"
    );

    this.draggingService.onDrop$
      .pipe(
        takeUntil(this.onDestroyedSubject),
        filter(
          (droppedDraggable) =>
            droppedDraggable === this.draggable && !!droppedDraggable.dropTarget
        ),
        map((droppedDraggable) => droppedDraggable.dropTarget)
      )
      .subscribe((dropTarget) =>
        this.droppedEvent.emit(dropTarget as DropTargetBase)
      );
  }

  ngOnDestroy(): void {
    this.onDestroyedSubject.next();
    this.onDestroyedSubject.complete();
  }
}
