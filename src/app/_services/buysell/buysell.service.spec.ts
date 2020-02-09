import { TestBed } from '@angular/core/testing';

import { BuysellService } from './buysell.service';

describe('BuysellService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BuysellService = TestBed.get(BuysellService);
    expect(service).toBeTruthy();
  });
});
