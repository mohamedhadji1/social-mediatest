/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { AddRequestService } from './add-request.service';

describe('Service: AddRequest', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AddRequestService]
    });
  });

  it('should ...', inject([AddRequestService], (service: AddRequestService) => {
    expect(service).toBeTruthy();
  }));
});
