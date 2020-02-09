import { TestBed } from '@angular/core/testing';

import { BusinessServiceService } from './business-service.service';

describe('BusinessServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BusinessServiceService = TestBed.get(BusinessServiceService);
    expect(service).toBeTruthy();
  });
});
