import { Component, OnInit, ViewChild, ElementRef, ViewEncapsulation, Input } from '@angular/core';
import { ResizedEvent } from 'angular-resize-event';
import { TimelineOptions } from './timeline-options';
import * as d3 from 'd3';
import { ScaleTime } from 'd3';

@Component({
  selector: 'dbvis-timeline-vis',
  templateUrl: './timeline-vis.component.html',
  styleUrls: ['./timeline-vis.component.less'],
  encapsulation: ViewEncapsulation.None
})
export class TimelineVisComponent implements OnInit {

  @ViewChild('svg') svgRef: ElementRef;

  private svg: SVGElement;

  private width: number;
  private height: number;

  private _options: TimelineOptions;

  constructor() { }

  ngOnInit() {
    this.svg = this.svgRef.nativeElement;
  }

  onResized(event: ResizedEvent) {
    this.width = event.newWidth - 30;
    this.height = 40; // constant height
    console.log('width', event.newWidth, 'height', event.newHeight);
    this.draw();
  }

  @Input()
  set options(options: TimelineOptions) {
    this._options = options;
    this.draw();
  }

  get options(): TimelineOptions {
    return this._options;
  }


  private draw(): void {
    if (!this.options) {
      return;
    }

    console.log('draw with options', this.options);

    const timeScale: ScaleTime<number, number> = d3.scaleTime()
      .domain([this.options.begin, this.options.end])
      .range([0, this.width]);

    d3.select(this.svg).selectAll('*').remove();

    d3.select(this.svg)
      .attr('width', this.width)
      .attr('height', this.height)
      .append('g')
      .attr('class', 'axis')
      .attr('transform', `translate(0, ${this.height - 20})`)
      .call(d3.axisBottom(timeScale));
  }

}
