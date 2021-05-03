import { ElementRef, Renderer2 } from '@angular/core';
import { DraggableBase } from '../models/draggable-base';
import { DraggingService } from '../services/dragging.service';
import { DraggableDirective } from './draggable.directive';

describe('DraggableDirective', () => {
  let elementRefSpy : jasmine.SpyObj<ElementRef>;
  let renderer2Spy : jasmine.SpyObj<Renderer2>;
  let draggingServiceSpy : jasmine.SpyObj<DraggingService>;
  let dragEventSpy : DragEvent;

  let directiveUnderTest : DraggableDirective;

  beforeEach(() => {
    elementRefSpy = jasmine.createSpyObj<ElementRef>("ElementRef", ["nativeElement"]);
    renderer2Spy = jasmine.createSpyObj<Renderer2>("Renderer2", ["addClass", "removeClass", "setAttribute"]);
    draggingServiceSpy = jasmine.createSpyObj<DraggingService>("DraggingService", ["startDragging", "stopDragging"]);

    dragEventSpy = jasmine.createSpyObj(dragEventSpy, ["preventDefault", "stopPropagation"]);

    directiveUnderTest = new DraggableDirective(elementRefSpy, renderer2Spy, draggingServiceSpy);
  });

  it('should create an instance', () => {
    const directive = new DraggableDirective(elementRefSpy, renderer2Spy, draggingServiceSpy);
    expect(directive).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should add the canDrag attribute to the element.', () => {
      // Arrange
      const expectedAttribute = "draggable";
      const expectedAttributeValue = "true";

      // Act
      directiveUnderTest.ngOnInit();

      // Assert
      expect(renderer2Spy.setAttribute).toHaveBeenCalledWith(elementRefSpy.nativeElement, expectedAttribute, expectedAttributeValue);
    });
  });

  describe('onDragStart', () => {
    it('should call startDragging in the dragging service', () => {
      // Arrange
      const draggable = new DraggableBase();

      directiveUnderTest.draggable = draggable;

      // Act
      directiveUnderTest.onDragStart(dragEventSpy);

      // Assert
      expect(draggingServiceSpy.startDragging).toHaveBeenCalledOnceWith(draggable);
    });

    it('should add the class default class "ez-dragging" if no user classes are set', () => {
      // Arrange
      const draggable = new DraggableBase();

      directiveUnderTest.draggable = draggable;

      // Act
      directiveUnderTest.onDragStart(dragEventSpy);

      // Assert
      expect(directiveUnderTest['_appliedStyles']).toEqual(["ez-dragging"]);
      expect(renderer2Spy.addClass).toHaveBeenCalledOnceWith(elementRefSpy.nativeElement, "ez-dragging");
    });

    it('should add the user defined classes', () => {
      // Arrange
      const draggable = new DraggableBase();

      directiveUnderTest.draggingStyles = ['a', 'b'];

      directiveUnderTest.draggable = draggable;

      // Act
      directiveUnderTest.onDragStart(dragEventSpy);

      // Assert
      expect(renderer2Spy.addClass).toHaveBeenCalledTimes(2);
      expect(directiveUnderTest['_appliedStyles']).toEqual(['a', 'b']);
      expect(renderer2Spy.addClass).toHaveBeenCalledWith(elementRefSpy.nativeElement, 'a');
      expect(renderer2Spy.addClass).toHaveBeenCalledWith(elementRefSpy.nativeElement, 'b');
    });
  });

  describe('onDragEnd', () => {
    it('should call stopDragging in the dragging service', () => {
      // Arrange
      const draggable = new DraggableBase();

      directiveUnderTest.draggable = draggable;

      // Act
      directiveUnderTest.onDragEnd(dragEventSpy);

      // Assert
      expect(draggingServiceSpy.stopDragging).toHaveBeenCalledTimes(1);
    });

    it('should remove the applied classes', () => {
      // Arrange
      const draggable = new DraggableBase();

      directiveUnderTest['_appliedStyles'] = ['a', 'b'];

      directiveUnderTest.draggable = draggable;

      // Act
      directiveUnderTest.onDragEnd(dragEventSpy);

      // Assert
      expect(renderer2Spy.removeClass).toHaveBeenCalledTimes(2);
      expect(directiveUnderTest['_appliedStyles']).toEqual([]);
      expect(renderer2Spy.removeClass).toHaveBeenCalledWith(elementRefSpy.nativeElement, 'a');
      expect(renderer2Spy.removeClass).toHaveBeenCalledWith(elementRefSpy.nativeElement, 'b');
    });
  });
});
