import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { permissionAccessGuard } from './permission-access.guard';

describe('permissionAccessGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => permissionAccessGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
