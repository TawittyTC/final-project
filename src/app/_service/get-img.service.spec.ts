import { TestBed } from '@angular/core/testing';

import { GetImgService } from './get-img.service';

describe('GetImgService', () => {
  let service: GetImgService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GetImgService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
