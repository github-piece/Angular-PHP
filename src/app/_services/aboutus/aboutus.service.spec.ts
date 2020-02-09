import { TestBed } from '@angular/core/testing';

import { AboutusService } from './aboutus.service';
import {beforeEach, describe, expect, it} from '@angular/core/testing/src/testing_internal';

describe('AboutusService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AboutusService = TestBed.get(AboutusService);
    expect(service).toBeTruthy();
  });
});
