import { Component, OnInit, ViewChild, ElementRef, Input, ViewEncapsulation } from '@angular/core';
import { isNullOrUndefined } from 'util';
import { Episode } from './episode';
import * as d3 from 'd3';

@Component({
  selector: 'dbvis-episode-vis',
  templateUrl: './episode-vis.component.html',
  styleUrls: ['./episode-vis.component.less'],
  encapsulation: ViewEncapsulation.None
})
export class EpisodeVisComponent implements OnInit {

  @ViewChild('svg') svgRef: ElementRef<SVGElement>;

  private _data: Episode;

  /**
   * the svg element
   */
  private svg: SVGElement;

  constructor() { }

  ngOnInit() {
    this.svg = this.svgRef.nativeElement;
  }


  @Input()
  set data(data: Episode) {
    this._data = data;
    if (!isNullOrUndefined(data)) {
      this.draw();
    }
  }

  get data(): Episode {
    return this._data;
  }


  private draw(): void {
    // explanation why this fails:

    // Episodes must be either an array: Episodes[]

    // Or the Episodes object must contain an array that can be put into the .data function (e.g., this._data.dataArray)

    // d3.select(this.svg)
    //   .data(this._data);
  }

}
