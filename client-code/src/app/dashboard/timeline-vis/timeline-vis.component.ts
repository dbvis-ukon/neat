import { Component, OnInit, ViewChild, ElementRef, ViewEncapsulation, Input, Output, EventEmitter } from '@angular/core';
import { ResizedEvent } from 'angular-resize-event';
import { TimelineOptions } from './timeline-options';
import * as d3 from 'd3';
import { ScaleTime } from 'd3';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { TimelineOtherBrushes } from './timeline-other-brushes';
import { StreamGraph } from './stream-graph';

@Component({
  selector: 'dbvis-timeline-vis',
  templateUrl: './timeline-vis.component.html',
  styleUrls: ['./timeline-vis.component.less'],
  encapsulation: ViewEncapsulation.None
})
export class TimelineVisComponent implements OnInit {

  @Output()
  public brushed: EventEmitter<[Date, Date]> = new EventEmitter();

  @ViewChild('svg') svgRef: ElementRef;

  private svg: SVGElement;

  private width: number;
  private height: number;

  private _options: TimelineOptions;

  private _otherBrushes: TimelineOtherBrushes[];

  private svgSelection: d3.Selection<SVGElement, null, undefined, null>;

  private streamGraphSelection: d3.Selection<SVGGElement, null, undefined, null>;

  private otherBrushesSelection: d3.Selection<SVGGElement, null, undefined, null>;

  private timeScale: ScaleTime<number, number> = d3.scaleTime();

  private axisBottom: d3.Axis<Date> = d3.axisBottom<Date>(this.timeScale);

  private axisSelection: d3.Selection<SVGGElement, null, undefined, null>;

  private brush: d3.BrushBehavior<{}> = d3.brushX()
  .extent([[0, 0], [10, 10]])
  .on('end', () => this._brushed());

  private brushSelection: d3.Selection<SVGGElement, null, undefined, null>;

  private streamGraph: StreamGraph;


  private lastBrush: [Date, Date];

  private brushDebouncer: Subject<[Date, Date]> = new Subject();

  constructor() { }

  @Input()
  set options(options: TimelineOptions) {
    this._options = options;

    this.timeScale.domain([this._options.begin, this._options.end]);

    this.updateRender();
  }

  get options(): TimelineOptions {
    return this._options;
  }

  @Input()
  set otherBrushes(otherBrushes: TimelineOtherBrushes[]) {
    this._otherBrushes = otherBrushes;

    this.drawOtherBrushes();
  }

  get otherBrushes(): TimelineOtherBrushes[] {
    return this._otherBrushes;
  }

  ngOnInit() {
    this.svg = this.svgRef.nativeElement;

    this.brushDebouncer
      .pipe(
        debounceTime(100)
      )
      .subscribe(brush => {
        this.brushed.emit(brush);
      });

    this.initVis();

    this.updateRanges();

    this.updateRender();
  }

  onResized(event: ResizedEvent) {
    this.width = event.newWidth - 30;
    this.height = 40; // constant height

    this.updateRanges();

    this.updateRender();
  }

  private initVis(): void {
    this.svgSelection = d3.select(this.svg);
    this.svgSelection.attr('class', 'timeline-viz');

    // add bottom axis
    this.axisSelection = this.svgSelection
      .append('g')
      .attr('class', 'axis')
      .attr('transform', `translate(0,0)`)
      .call(this.axisBottom);

    this.streamGraphSelection = this.svgSelection
      .append('g')
      .attr('class', 'stream-graph');

    this.streamGraph = new StreamGraph(this.streamGraphSelection);

    this.otherBrushesSelection = this.svgSelection
      .append('g');

    // add brush
    this.brushSelection = this.svgSelection
      .append('g')
      .attr('class', 'brush');
  }

  private updateRanges(): void {
    if (!this.width || !this.height) {
      return;
    }

    this.timeScale.range([0, this.width]);


    this.brush.extent([[0, 0], [this.width, this.height]]);
  }


  private updateRender(): void {
    if (!this.options || !this.width || !this.height) {
      return;
    }

    // update svg width / height
    this.svgSelection
      .attr('width', this.width)
      .attr('height', this.height);

    this.axisSelection
      .attr('transform', `translate(0,  ${this.height - 20})`)
      .call(this.axisBottom);

    // either use the brush from the last brush selection or brush the whole time series.
    const brushRange = this.lastBrush ? [this.timeScale(this.lastBrush[0]), this.timeScale(this.lastBrush[1])] : this.timeScale.range();

    this.brushSelection
      .call(this.brush)
      .call(this.brush.move, brushRange);

    // update the color of the brush
    this.brushSelection.select('rect.selection')
      .attr('fill', this._options.userColor);

    this.streamGraph.render('hello world', this.width, this.height);
  }

  /**
   * called when the user performs a brush
   */
  private _brushed(): void {
    if (d3.event.sourceEvent && d3.event.sourceEvent.type === 'zoom') { return; } // ignore brush-by-zoom
    const s = d3.event.selection;
    this.lastBrush = s.map(this.timeScale.invert, this.timeScale);

    this.brushDebouncer.next(this.lastBrush);
  }

  private drawOtherBrushes() {
    if (!this.otherBrushesSelection || !this._otherBrushes || !this.timeScale) {
      return;
    }

    console.log('draw other brushes', this._otherBrushes);

    const rects = this.otherBrushesSelection
      .selectAll<SVGRectElement, TimelineOtherBrushes>('rect')
      .data(this._otherBrushes, d => d.name);

    rects
      .enter()
      .append('rect')
      .merge(rects)
      .attr('x', d => this.timeScale(new Date(d.brush[0])))
      .attr('y', 0)
      .attr('width', d => this.timeScale(new Date(d.brush[1])) - this.timeScale(new Date(d.brush[0])))
      .attr('height', this.height)
      .attr('stroke', d => d.color)
      .attr('fill', 'none')
      .attr('stroke-width', 2);

    rects.exit().remove();
  }
}
