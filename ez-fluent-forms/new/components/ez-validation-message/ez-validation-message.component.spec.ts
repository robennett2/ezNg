import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EzValidationMessageComponent } from './ez-validation-message.component';

describe('EzValidationMessageComponent', () => {
  let component: EzValidationMessageComponent;
  let fixture: ComponentFixture<EzValidationMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EzValidationMessageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EzValidationMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
