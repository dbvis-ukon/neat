import { Injectable } from '@angular/core';
import { Episode } from './episode';

@Injectable({
  providedIn: 'root'
})
export class EpisodeCalculatorService {

  constructor() { }

  public calculate(data: Episode): number {
    return -1;
  }
}
