import { TestBed, inject } from '@angular/core/testing';

import { SocketIo as NgIoService } from './ng-io.service';

describe('NgIoService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NgIoService]
    });
  });

  it('should be created', inject([NgIoService], (service: NgIoService) => {
    expect(service).toBeTruthy();
  }));
});
