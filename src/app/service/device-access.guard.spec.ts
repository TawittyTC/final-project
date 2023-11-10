import { TestBed } from '@angular/core/testing';

import { DeviceAccessGuard } from './device-access.guard';

describe('DeviceAccessGuard', () => {
  let guard: DeviceAccessGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(DeviceAccessGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
