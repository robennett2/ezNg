import { DraggableBase } from './draggable-base';
import { DropTargetBase } from './drop-target-base';

describe('Draggable', () => {
  it('should create an instance', () => {
    expect(new DraggableBase()).toBeTruthy();
  });

  describe('construction', () => {
    it('should correctly initialse the targatables array and drop target when NO values are provided', () => {
      // Act
      const draggable = new DraggableBase();

      // Assert
      expect(draggable.targetables).toEqual(['default']);
      expect(draggable.dropTarget).toBeNull();
    });
  });

  describe('set dropTarget', () => {
    it('should set the old dropTarget.draggable to null when a new one is assigned', () => {
      // Arrange
      const existingDropTarget = new DropTargetBase();
      const existingSetDropTargetDraggableSpy = spyOnProperty(
        existingDropTarget,
        'draggable',
        'set'
      );

      const newDropTarget = new DropTargetBase();

      const draggable = new DraggableBase(['default'], existingDropTarget);

      // Act
      draggable.dropTarget = newDropTarget;

      // Assert
      expect(existingSetDropTargetDraggableSpy).toHaveBeenCalledOnceWith(null);
    });
  });
});
