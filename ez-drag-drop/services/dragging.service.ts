import { Injectable } from '@angular/core';
import { DraggableAlreadyActiveError } from '../errors/draggable-already-active.error';
import { NoDraggableActiveError } from '../errors/no-draggable-active.error';
import { DraggableBase } from '../models/draggable-base';
import { DropTargetBase } from '../models/drop-target-base';

@Injectable({
  providedIn: 'root',
})
export class DraggingService {
  private _activeDraggable: DraggableBase | null = null;

  public get activeDraggable(): DraggableBase | null {
    return this._activeDraggable;
  }

  constructor() {}

  startDragging(draggable: DraggableBase): void {
    if (this.activeDraggable !== null) {
      throw DraggableAlreadyActiveError();
    }

    this._activeDraggable = draggable;
  }

  canDrop(dropTarget: DropTargetBase): boolean {
    if (!this.activeDraggable) {
      throw NoDraggableActiveError();
    }

    return dropTarget.canDrop(this.activeDraggable);
  }

  drop(dropTarget: DropTargetBase): void {
    if (!this.activeDraggable) {
      throw NoDraggableActiveError();
    }

    if (this.canDrop(dropTarget)) {
      dropTarget.recieveDraggable(this.activeDraggable);
    }

    this.stopDragging();
  }

  stopDragging(): void {
    this._activeDraggable = null;
  }
}
