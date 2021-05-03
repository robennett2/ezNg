import { DropTargetBase } from "./drop-target-base";

export class DraggableBase {
  private _targetables: string[];
  public get targetables(): string[] {
    return this._targetables;
  }

  private _dropTarget: DropTargetBase | null;
  public set dropTarget(value: DropTargetBase | null) {
    if (this._dropTarget)
      this._dropTarget.draggable = null;

    this._dropTarget = value;
  }
  public get dropTarget() : DropTargetBase | null {
    return this._dropTarget;
  }

  constructor(targetables : string[] = ["default"], dropTarget : DropTargetBase | null = null) {
    this._targetables = targetables;
    this._dropTarget = dropTarget;
  }
}
