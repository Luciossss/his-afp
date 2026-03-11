import { TestBed } from '@angular/core/testing';

import { StatoApi } from './stato-api';

describe('StatoApi', () => {
  let service: StatoApi;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StatoApi);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
