import { TestBed } from '@angular/core/testing';

import { HowtoService } from './howto.service';
import {beforeEach, describe, expect, it} from '@angular/core/testing/src/testing_internal';

describe('HowtoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: HowtoService = TestBed.get(HowtoService);
    expect(service).toBeTruthy();
  });
});
