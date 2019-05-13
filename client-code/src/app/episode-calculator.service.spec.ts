import { TestBed } from '@angular/core/testing';

import { EpisodeCalculatorService } from './episode-calculator.service';

describe('EpisodeCalculatorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EpisodeCalculatorService = TestBed.get(EpisodeCalculatorService);
    expect(service).toBeTruthy();
  });
});
