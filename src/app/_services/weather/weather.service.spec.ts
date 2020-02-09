import { TestBed } from '@angular/core/testing';

import { WeatherService } from './weather.service';
import {beforeEach, describe, expect, it} from '@angular/core/testing/src/testing_internal';

describe('WeatherService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WeatherService = TestBed.get(WeatherService);
    expect(service).toBeTruthy();
  });
});
