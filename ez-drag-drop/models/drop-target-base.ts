import { DraggableBase } from './draggable-base';

export class DropTargetBase {
  private _name: string;
  get name(): string {
    return this._name;
  }

  private _draggable: DraggableBase | null;
  set draggable(value: DraggableBase | null) {
    this._draggable = value;
  }
  get draggable(): DraggableBase | null {
    return this._draggable;
  }

  constructor(
    name: string = 'default',
    draggable: DraggableBase | null = null
  ) {
    this._name = name;
    this._draggable = draggable;

    if (this.draggable) {
      this.draggable.dropTarget = this;
    }
  }

  canDrop(draggable: DraggableBase): boolean {
    return draggable.targetables.includes(this.name) && !this.draggable;
  }

  recieveDraggable(draggable: DraggableBase): boolean {
    if (!this.canDrop(draggable)) {
      return false;
    }

    draggable.dropTarget = this;
    this._draggable = draggable;

    return true;
  }
}
