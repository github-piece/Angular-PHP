import { TestBed } from '@angular/core/testing';

import { AnswerService } from './answer.service';
import {beforeEach, describe, expect, it} from '@angular/core/testing/src/testing_internal';

describe('AnswerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AnswerService = TestBed.get(AnswerService);
    expect(service).toBeTruthy();
  });
});
