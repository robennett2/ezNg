import { ElementRef, Renderer2 } from "@angular/core";
import { DraggableBase } from "../models/draggable-base";
import { DropTargetBase } from "../models/drop-target-base";
import { DraggingService } from "../services/dragging.service";
import { DropTargetDirective } from "./drop-target.directive";

function getSpiedPropertyGetter<T, K extends keyof T>(
  spyObj: jasmine.SpyObj<T>,
  propName: K
): jasmine.Spy<() => T[K]> {
  return Object.getOwnPropertyDescriptor(spyObj, propName)?.get as jasmine.Spy<
    () => T[K]
  >;
}

describe("DraggableDirective", () => {
  let elementRefSpy: jasmine.SpyObj<ElementRef>;
  let renderer2Spy: jasmine.SpyObj<Renderer2>;
  let draggingServiceSpy: jasmine.SpyObj<DraggingService>;
  let dragEventSpy: jasmine.SpyObj<DragEvent>;

  let directiveUnderTest: DropTargetDirective;

  beforeEach(() => {
    elementRefSpy = jasmine.createSpyObj<ElementRef>("ElementRef", [
      "nativeElement",
    ]);

    renderer2Spy = jasmine.createSpyObj<Renderer2>("Renderer2", [
      "addClass",
      "removeClass",
    ]);

    draggingServiceSpy = jasmine.createSpyObj<DraggingService>(
      "DraggingService",
      ["canDrop", "drop"],
      ["activeDraggable"]
    );

    getSpiedPropertyGetter(
      draggingServiceSpy,
      "activeDraggable"
    ).and.returnValue({} as DraggableBase);

    dragEventSpy = jasmine.createSpyObj("DragEvent", [
      "preventDefault",
      "stopPropagation",
    ]);

    directiveUnderTest = new DropTargetDirective(
      elementRefSpy,
      renderer2Spy,
      draggingServiceSpy
    );
  });

  it("should create an instance", () => {
    const directive = new DropTargetDirective(
      elementRefSpy,
      renderer2Spy,
      draggingServiceSpy
    );
    expect(directive).toBeTruthy();
  });

  describe("onDragOver", () => {
    it("should call canDrop in the dragging service and if it can drop then preventDefault and stopPropagation are called", () => {
      // Arrange
      const dropTarget = new DropTargetBase();

      draggingServiceSpy.canDrop.and.returnValue(true);

      directiveUnderTest.dropTarget = dropTarget;

      // Act
      directiveUnderTest.onDragOver(dragEventSpy);

      // Assert
      expect(draggingServiceSpy.canDrop).toHaveBeenCalledOnceWith(dropTarget);
      expect(dragEventSpy.preventDefault).toHaveBeenCalledTimes(1);
      expect(dragEventSpy.stopPropagation).toHaveBeenCalledTimes(1);
    });

    it("should call canDrop in the dragging service and if it can NOT drop then preventDefault and stopPropagation are NOT called", () => {
      // Arrange
      const dropTarget = new DropTargetBase();

      draggingServiceSpy.canDrop.and.returnValue(false);

      directiveUnderTest.dropTarget = dropTarget;

      // Act
      directiveUnderTest.onDragOver(dragEventSpy);

      // Assert
      expect(draggingServiceSpy.canDrop).toHaveBeenCalledOnceWith(dropTarget);
      expect(dragEventSpy.preventDefault).not.toHaveBeenCalled();
      expect(dragEventSpy.stopPropagation).not.toHaveBeenCalled();
    });

    it("should not call canDrop if the activeDraggable is not truthy", () => {
      // Arrange
      getSpiedPropertyGetter(
        draggingServiceSpy,
        "activeDraggable"
      ).and.returnValue(null);

      // Act
      directiveUnderTest.onDragOver(dragEventSpy);

      // Assert
      expect(draggingServiceSpy.canDrop).not.toHaveBeenCalled();
      expect(dragEventSpy.preventDefault).not.toHaveBeenCalled();
      expect(dragEventSpy.stopPropagation).not.toHaveBeenCalled();
    });

    it("should not apply any styling activeDraggable is not truthy", () => {
      // Arrange
      getSpiedPropertyGetter(
        draggingServiceSpy,
        "activeDraggable"
      ).and.returnValue(null);

      // Act
      directiveUnderTest.onDragOver(dragEventSpy);

      // Assert
      expect(renderer2Spy.addClass).not.toHaveBeenCalled();
      expect(directiveUnderTest["_appliedStyles"].length).toEqual(0);
    });

    describe("styling - default", () => {
      it('should apply the default classes "ez-drag-over" and "ez-can-drop" when the drag over event is triggered and the draggable can be dropped', () => {
        // Arrange
        const dropTarget = new DropTargetBase();

        draggingServiceSpy.canDrop.and.returnValue(true);

        directiveUnderTest.dropTarget = dropTarget;

        // Act
        directiveUnderTest.onDragOver(dragEventSpy);

        // Assert
        expect(renderer2Spy.addClass).toHaveBeenCalledTimes(2);
        expect(renderer2Spy.addClass).toHaveBeenCalledWith(
          elementRefSpy.nativeElement,
          "ez-drag-over"
        );
        expect(renderer2Spy.addClass).toHaveBeenCalledWith(
          elementRefSpy.nativeElement,
          "ez-can-drop"
        );
      });

      it('should apply the default classes "ez-drag-over" and "ez-can-not-drop" when the drag over event is triggered and the draggable can NOT be dropped', () => {
        // Arrange
        const dropTarget = new DropTargetBase();

        draggingServiceSpy.canDrop.and.returnValue(false);

        directiveUnderTest.dropTarget = dropTarget;

        // Act
        directiveUnderTest.onDragOver(dragEventSpy);

        // Assert
        expect(renderer2Spy.addClass).toHaveBeenCalledTimes(2);
        expect(renderer2Spy.addClass).toHaveBeenCalledWith(
          elementRefSpy.nativeElement,
          "ez-drag-over"
        );
        expect(renderer2Spy.addClass).toHaveBeenCalledWith(
          elementRefSpy.nativeElement,
          "ez-can-not-drop"
        );
      });
    });

    describe("styling - user", () => {
      it("should apply the user defined classes when the drag over event is triggered and the draggable can be dropped", () => {
        // Arrange
        const dropTarget = new DropTargetBase();
        directiveUnderTest.dragOverStyles = ["a", "b"];
        directiveUnderTest.canDropStyles = ["c", "d"];

        draggingServiceSpy.canDrop.and.returnValue(true);

        directiveUnderTest.dropTarget = dropTarget;

        // Act
        directiveUnderTest.onDragOver(dragEventSpy);

        // Assert
        expect(renderer2Spy.addClass).toHaveBeenCalledTimes(4);
        expect(renderer2Spy.addClass).toHaveBeenCalledWith(
          elementRefSpy.nativeElement,
          "a"
        );
        expect(renderer2Spy.addClass).toHaveBeenCalledWith(
          elementRefSpy.nativeElement,
          "b"
        );
        expect(renderer2Spy.addClass).toHaveBeenCalledWith(
          elementRefSpy.nativeElement,
          "c"
        );
        expect(renderer2Spy.addClass).toHaveBeenCalledWith(
          elementRefSpy.nativeElement,
          "d"
        );
      });

      it("should apply the user defined classes when the drag over event is triggered and the draggable can NOT be dropped", () => {
        // Arrange
        const dropTarget = new DropTargetBase();
        directiveUnderTest.dragOverStyles = ["a", "b"];
        directiveUnderTest.canNotDropStyles = ["c", "d"];

        draggingServiceSpy.canDrop.and.returnValue(false);

        directiveUnderTest.dropTarget = dropTarget;

        // Act
        directiveUnderTest.onDragOver(dragEventSpy);

        // Assert
        expect(renderer2Spy.addClass).toHaveBeenCalledTimes(4);
        expect(directiveUnderTest["_appliedStyles"]).toEqual([
          "a",
          "b",
          "c",
          "d",
        ]);
        expect(renderer2Spy.addClass).toHaveBeenCalledWith(
          elementRefSpy.nativeElement,
          "a"
        );
        expect(renderer2Spy.addClass).toHaveBeenCalledWith(
          elementRefSpy.nativeElement,
          "b"
        );
        expect(renderer2Spy.addClass).toHaveBeenCalledWith(
          elementRefSpy.nativeElement,
          "c"
        );
        expect(renderer2Spy.addClass).toHaveBeenCalledWith(
          elementRefSpy.nativeElement,
          "d"
        );
      });
    });
  });

  describe("onDragLeave", () => {
    it("should remove the drag over styles", () => {
      // Arrange
      const styles = ["a", "b", "c", "d"];
      const dragOverStyles = styles.slice(1);
      const appliedStyles = styles.slice(0, 2);

      directiveUnderTest["_appliedStyles"] = appliedStyles;
      directiveUnderTest.dragOverStyles = dragOverStyles;

      // Act
      directiveUnderTest.onDragLeave(dragEventSpy);

      // Assert
      expect(renderer2Spy.removeClass).toHaveBeenCalledTimes(
        dragOverStyles.length
      );
      dragOverStyles.forEach((style) =>
        expect(renderer2Spy.removeClass).toHaveBeenCalledWith(
          elementRefSpy.nativeElement,
          style
        )
      );

      expect(directiveUnderTest["_appliedStyles"].length).toEqual(1);
      expect(directiveUnderTest["_appliedStyles"]).toContain("a");
    });
  });

  describe("onDrop", () => {
    it("should call drop in the dragging service", () => {
      // Arrange
      const dropTarget = new DropTargetBase();

      directiveUnderTest.dropTarget = dropTarget;

      // Act
      directiveUnderTest.onDrop(dragEventSpy);

      // Assert
      expect(draggingServiceSpy.drop).toHaveBeenCalledOnceWith(dropTarget);
    });

    it("should remove applied classes", () => {
      // Arrange
      const dropTarget = new DropTargetBase();

      directiveUnderTest["_appliedStyles"] = ["a", "b", "c", "d"];

      directiveUnderTest.dropTarget = dropTarget;

      // Act
      directiveUnderTest.onDrop(dragEventSpy);

      // Assert
      expect(renderer2Spy.removeClass).toHaveBeenCalledTimes(4);
      expect(directiveUnderTest["_appliedStyles"]).toEqual([]);
      expect(renderer2Spy.removeClass).toHaveBeenCalledWith(
        elementRefSpy.nativeElement,
        "a"
      );
      expect(renderer2Spy.removeClass).toHaveBeenCalledWith(
        elementRefSpy.nativeElement,
        "b"
      );
      expect(renderer2Spy.removeClass).toHaveBeenCalledWith(
        elementRefSpy.nativeElement,
        "c"
      );
      expect(renderer2Spy.removeClass).toHaveBeenCalledWith(
        elementRefSpy.nativeElement,
        "d"
      );
    });
  });
});
