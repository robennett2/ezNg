import { TestBed } from '@angular/core/testing';

import { EzValidationMessageService } from './ez-validation-message.service';

describe('EzValidationMessageService', () => {
  let service: EzValidationMessageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EzValidationMessageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
