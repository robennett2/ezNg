import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EzValidationMessageHostComponent } from './ez-validation-message-host.component';

describe('EzValidationMessageHostComponent', () => {
  let component: EzValidationMessageHostComponent;
  let fixture: ComponentFixture<EzValidationMessageHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EzValidationMessageHostComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EzValidationMessageHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
