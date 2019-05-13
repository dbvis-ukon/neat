import { Component, OnInit, ViewChild, ElementRef, Input, ViewEncapsulation } from '@angular/core';
import { isNullOrUndefined } from 'util';
import { Episode } from './episode';
import * as d3 from 'd3';
import { EpisodeCalculatorService } from '../episode-calculator.service';

@Component({
  selector: 'dbvis-episode-vis',
  templateUrl: './episode-vis.component.html',
  styleUrls: ['./episode-vis.component.less'],
  encapsulation: ViewEncapsulation.None
})
export class EpisodeVisComponent implements OnInit {

  @ViewChild('svg') svgRef: ElementRef;

  /**
   * the svg element
   */
  private svg: SVGElement;

  constructor(private episodeCalculator: EpisodeCalculatorService) { }

  ngOnInit() {
    this.svg = this.svgRef.nativeElement;
  }


  @Input()
  set data(data: Episode) {
    if (!isNullOrUndefined(data)) {
      this.draw();
      this.episodeCalculator.calculate(data);
    }
  }


  private draw(): void {
    d3.select(this.svg)
    .data(this.data);
  }

}
