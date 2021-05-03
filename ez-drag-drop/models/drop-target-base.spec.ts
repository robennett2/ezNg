import { DraggableBase } from './draggable-base';
import { DropTargetBase } from './drop-target-base';

describe('DropTarget', () => {
  it('should create an instance', () => {
    expect(new DropTargetBase()).toBeTruthy();
  });

  describe('construction', () => {
    it('should initialse name to "default" when NO value is provided.', () => {
      // Act
      const dropTarget = new DropTargetBase();

      // Assert
      expect(dropTarget.name).toBe("default");
    });

    it('should initialse name to the value passed when a value is provided.', () => {
      // Arrange
      const expectedName = "test";

      // Act
      const dropTarget = new DropTargetBase(expectedName);

      // Assert
      expect(dropTarget.name).toBe(expectedName);
    });

    it('should initialsie draggable to null', () => {
      // Assert
      expect(new DropTargetBase().draggable).toBeNull();
    });
  });

  describe('canDrop', () => {
    it('should return true if the draggable contains the name in its targetables array AND there is no draggable assigned', () => {
      // Arrange
      const targetables = ["a", "b", "c"];
      const draggable = new DraggableBase();
      spyOnProperty(draggable, "targetables", "get").and.returnValue(targetables);

      const dropTarget = new DropTargetBase("b");

      // Act
      const canDrop = dropTarget.canDrop(draggable);

      // Assert
      expect(canDrop).toBeTrue();
    });

    it('should return false if the draggable DOES NOT contain the name in its targetables array AND there is NO draggable assigned', () => {
      // Arrange
      const targetables = ["a", "b", "c"];
      const draggable = new DraggableBase();
      spyOnProperty(draggable, "targetables", "get").and.returnValue(targetables);

      const dropTarget = new DropTargetBase();

      // Act
      const canDrop = dropTarget.canDrop(draggable);

      // Assert
      expect(canDrop).toBeFalse();
    });

    it('should return false if the draggable contains the name in its targetables array AND there is a draggable assigned', () => {
      // Arrange
      const targetables = ["a", "b", "c"];
      const draggable = new DraggableBase();
      spyOnProperty(draggable, "targetables", "get").and.returnValue(targetables);

      const dropTarget = new DropTargetBase("b");
      dropTarget.draggable = draggable;

      // Act
      const canDrop = dropTarget.canDrop(draggable);

      // Assert
      expect(canDrop).toBeFalse();
    });
  });

  it('should return false if the draggable DOES NOT contain the name in its targetables array AND there is a draggable assigned', () => {
    // Arrange
    const targetables = ["a", "b", "c"];
    const draggable = new DraggableBase();
    spyOnProperty(draggable, "targetables", "get").and.returnValue(targetables);

    const dropTarget = new DropTargetBase();
    dropTarget.draggable = draggable;

    // Act
    const canDrop = dropTarget.canDrop(draggable);

    // Assert
    expect(canDrop).toBeFalse();
  });

  describe('recieveDraggable', () => {
    it('should check if the draggable can be dropped and return false if it has been dropped', () => {
      // Arrange
      const targetables = ["a", "b", "c"];
      const draggable = new DraggableBase();
      spyOnProperty(draggable, "targetables", "get").and.returnValue(targetables);

      const dropTarget = new DropTargetBase("b");

      // Act
      const hasDropped = dropTarget.recieveDraggable(draggable);

      // Assert
      expect(hasDropped).toBeTrue();
    });

    it('should check if the draggable can be dropped and return false if it CAN NOT be dropped', () => {
      // Arrange
      const targetables = ["default"];
      const draggable = new DraggableBase();
      spyOnProperty(draggable, "targetables", "get").and.returnValue(targetables);

      const dropTarget = new DropTargetBase("test");

      // Act
      const hasDropped = dropTarget.recieveDraggable(draggable);

      // Assert
      expect(hasDropped).toBeFalse();
    });

    it('should set the drop target property on the draggable', () => {
      // Arrange
      const targetables = ["default"];
      const draggable = new DraggableBase();
      spyOnProperty(draggable, "targetables", "get").and.returnValue(targetables);
      const setDropTargetSpy = spyOnProperty(draggable, "dropTarget", "set");

      const dropTarget = new DropTargetBase();

      // Act
      const hasDropped = dropTarget.recieveDraggable(draggable);

      // Assert
      expect(hasDropped).toBeTrue();
      expect(setDropTargetSpy).toHaveBeenCalledOnceWith(dropTarget);
    });
  });
});
