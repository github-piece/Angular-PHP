import { TestBed } from '@angular/core/testing';

import { ForgotpwdService } from './forgotpwd.service';

describe('ForgotpwdService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ForgotpwdService = TestBed.get(ForgotpwdService);
    expect(service).toBeTruthy();
  });
});
