import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef, Input } from '@angular/core';
import { MapData } from './map-data';
import { ResizedEvent } from 'angular-resize-event';
import { TimelineOptions } from '../timeline-vis/timeline-options';
import { ScaleTime, ScaleLinear } from 'd3';
import * as d3 from 'd3';

@Component({
  selector: 'dbvis-map-vis',
  templateUrl: './map-vis.component.html',
  styleUrls: ['./map-vis.component.less'],
  encapsulation: ViewEncapsulation.None
})
export class MapVisComponent implements OnInit {

  @ViewChild('svg') svgRef: ElementRef;

  private svg: SVGElement;

  private width = 300;
  private height = 150;

  private _data: MapData[];

  constructor() { }

  ngOnInit() {
    this.svg = this.svgRef.nativeElement;
  }

  onResized(event: ResizedEvent) {
    // this.width = 350;
    // this.height = 150;
    // console.log('width', event.newWidth, 'height', event.newHeight);
    // this.draw();
  }

  @Input()
  set data(data: MapData[]) {
    this._data = data;
    this.draw();
  }

  get data(): MapData[] {
    return this._data;
  }


  private draw(): void {
    if (!this._data) {
      return;
    }

    console.log('draw with data', this._data);

    const scaleX: ScaleLinear<number, number> = d3.scaleLinear()
      .domain(d3.extent(this._data, d => d.x))
      .range([20, this.width - 20]);

    const scaleY: ScaleLinear<number, number> = d3.scaleLinear()
      .domain(d3.extent(this._data, d => d.y))
      .range([this.height - 20, 20]);

    const scaleR: ScaleLinear<number, number> = d3.scaleLinear()
      .domain(d3.extent(this._data, d => d.r))
      .range([10, 30]);

    d3.select(this.svg).selectAll('*').remove();

    const g = d3.select(this.svg)
      .attr('width', this.width)
      .attr('height', this.height)
      .append('g');

    g.selectAll('circle')
      .data(this._data)
      .enter()
      .append('circle')
      .style('fill', 'black')
      .attr('cx', d => scaleX(d.x))
      .attr('cy', d => scaleY(d.y))
      .attr('r', d => scaleR(d.r));
  }

}
