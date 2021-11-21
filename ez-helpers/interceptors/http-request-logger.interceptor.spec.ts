import { TestBed } from '@angular/core/testing';

import { HttpRequestLoggerInterceptor } from './http-request-logger.interceptor';

describe('HttpRequestLoggerInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      HttpRequestLoggerInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: HttpRequestLoggerInterceptor = TestBed.inject(HttpRequestLoggerInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
