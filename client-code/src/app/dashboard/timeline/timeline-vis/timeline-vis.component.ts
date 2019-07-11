import { Component, OnInit, ViewChild, ElementRef, ViewEncapsulation, Input, Output, EventEmitter } from '@angular/core';
import { ResizedEvent } from 'angular-resize-event';
import { TimelineOptions } from '../timeline-options';
import * as d3 from 'd3';
import { ScaleTime, ScaleOrdinal } from 'd3';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { TimelineOtherBrushes } from '../timeline-other-brushes';
import { StreamGraph } from './stream-graph';
import { StreamGraphItem } from '../stream-graph-item';
import { TooltipService } from '@app/core/services/tooltip.service';
import { StreamGraphRepositoryService } from '../stream-graph-repository.service';

@Component({
  selector: 'dbvis-timeline-vis',
  templateUrl: './timeline-vis.component.html',
  styleUrls: ['./timeline-vis.component.less'],
  encapsulation: ViewEncapsulation.None
})
export class TimelineVisComponent implements OnInit {

  @Output()
  public brushed: EventEmitter<[Date, Date]> = new EventEmitter();

  @ViewChild('svg') svgRef: ElementRef<SVGSVGElement>;

  private svg: SVGSVGElement;

  private width: number;
  private height: number;

  private _options: TimelineOptions;

  private _otherBrushes: TimelineOtherBrushes[];

  private _brushExternal: [Date, Date];

  private svgSelection: d3.Selection<SVGSVGElement, null, undefined, null>;

  private streamGraphSelection: d3.Selection<SVGGElement, null, undefined, null>;

  private otherBrushesSelection: d3.Selection<SVGGElement, null, undefined, null>;

  private timeScale: ScaleTime<number, number> = d3.scaleTime();

  private axisBottom: d3.Axis<Date> = d3.axisBottom<Date>(this.timeScale);

  private axisSelection: d3.Selection<SVGGElement, null, undefined, null>;

  private hoverLineGroupSelection: d3.Selection<SVGGElement, null, undefined, null>;
  private hoverLineSelection: d3.Selection<SVGLineElement, null, undefined, null>;
  private hoverTextSelection: d3.Selection<SVGTextElement, null, undefined, null>;

  private brush: d3.BrushBehavior<{}> = d3.brushX()
  .extent([[0, 0], [10, 10]])
  .on('end', () => this._brushed());

  private brushSelection: d3.Selection<SVGGElement, null, undefined, null>;

  private streamGraph: StreamGraph;


  private lastBrush: [Date, Date];

  private brushDebouncer: Subject<[Date, Date]> = new Subject();

  private _streamGraphData: StreamGraphItem[];
  private _streamGraphColorScale: ScaleOrdinal<string, string>;

  private _hoverLine: Date = new Date();

  @Output()
  hoverLineChange: EventEmitter<Date> = new EventEmitter();

  constructor(
    private tooltipService: TooltipService,
    private streamGraphRepository: StreamGraphRepositoryService) { }

  @Input()
  set hoverLine(cur: Date) {
    this._hoverLine = cur;
    this.updateHoverLine(true);
  }

  get hoverLine(): Date {
    return this._hoverLine;
  }

  @Input()
  set streamGraphData(streamGraphData: StreamGraphItem[]) {
    this._streamGraphData = streamGraphData;


    this.updateStreamGraph();
  }

  get streamGraphData(): StreamGraphItem[] {
    return this._streamGraphData;
  }

  @Input()
  set streamGraphColorScale(streamGraphColorScale: ScaleOrdinal<string, string>) {
    if (!streamGraphColorScale) {
      streamGraphColorScale = d3.scaleOrdinal();
    }
    this._streamGraphColorScale = streamGraphColorScale;


    this.updateStreamGraph();
  }

  get streamGraphColorScale(): ScaleOrdinal<string, string> {
    return this._streamGraphColorScale;
  }

  @Input()
  set options(options: TimelineOptions) {
    this._options = options;

    this.timeScale.domain([this._options.begin, this._options.end]);

    this.updateRender();
    this.updateStreamGraph();
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

  @Input()
  set brushExternal(brushExternal: [Date, Date]) {
    this._brushExternal = brushExternal;

    if (brushExternal && brushExternal[0] && brushExternal[1]) {
      this.updateOwnBrush(brushExternal);
    }
  }

  get brushExternal(): [Date, Date] {
    return this._brushExternal;
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

    // this.http.get<StreamGraphItem[]>('/assets/streamgraphdata.json').subscribe(data => {
    //   this.streamGraphData = data;
    // });

    this.updateStreamGraph();

    this.updateOwnBrush(this._brushExternal);
  }

  onResized(event: ResizedEvent) {
    this.width = event.newWidth - 30;
    this.height = this._options.height; // constant height

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

    this.hoverLineGroupSelection = this.svgSelection
      .append('g')
      .attr('class', 'hoverLineGroup');
    this.hoverLineGroupSelection.append('rect')
      .attr('width', this.width)
      .attr('height', this.height)
      .attr('fill', 'none')
      .attr('pointer-events', 'all')
      .on('mousemove', () => {
        const mouseX = d3.mouse(this.svgSelection.node())[0];
        const t = this.timeScale.invert(mouseX);
        this.hoverLineChange.emit(t);

        this.updateHoverLine(true);
      });

    this.streamGraphSelection = this.svgSelection
      .append('g')
      .attr('class', 'stream-graph');

    this.streamGraph = new StreamGraph(this.streamGraphSelection, this.tooltipService, this.streamGraphRepository, this.hoverLineChange);

    if (this._options.brushOn) {
      this.otherBrushesSelection = this.svgSelection
        .append('g');

    // add brush
      this.brushSelection = this.svgSelection
        .append('g')
        .attr('class', 'brush');
    }

    this.hoverLineSelection = this.svgSelection.append('line')
      .attr('y1', 0)
      .attr('y2', this.height)
      .attr('x1', 100)
      .attr('x2', 100)
      .attr('stroke-width', '2px')
      .attr('pointer-events', 'none')
      .attr('stroke', 'black');

    this.hoverTextSelection = this.svgSelection.append('text')
      .attr('y', 12)
      .attr('pointer-events', 'none')
      .style('font-size', '10px');
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

    // update hoverline rect width / height
    this.hoverLineGroupSelection.select('rect')
      .attr('width', this.width)
      .attr('height', this.height);
    this.hoverLineSelection
      .attr('y1', 0)
      .attr('y2', this.height);

    this.axisSelection
      .attr('transform', `translate(0,  ${this.height - 20})`)
      .call(this.axisBottom);

    this.updateOwnBrush();
    this.updateStreamGraph();
  }

  private updateHoverLine(showText = true): void {
    const x = this.timeScale(this._hoverLine);

    if (!this.hoverLineGroupSelection) {
      return;
    }

    this.hoverLineSelection
      .attr('x1', x)
      .attr('x2', x);

    const timeFormat = d3.timeFormat('%Y-%m-%d %H:%M:%S');

    const txt = showText && this._hoverLine ? timeFormat(this._hoverLine) : '';
    const txtX = x < this.width / 2 ? x + 2 : x - 122;

    this.hoverTextSelection
      .attr('x', txtX)
      .text(txt);
  }

  private updateOwnBrush(externalBrush?: [Date, Date]) {
    if (!this.brush || !this.brushSelection) {
      return;
    }
    let brushRange = null;
    if (externalBrush) {
      brushRange = [this.timeScale(externalBrush[0]), this.timeScale(externalBrush[1])];
    } else if (this.lastBrush) {
      brushRange = [this.timeScale(this.lastBrush[0]), this.timeScale(this.lastBrush[1])];
    } else {
      brushRange = this.timeScale.range();
    }

    this.brushSelection
      .call(this.brush)
      .call(this.brush.move, brushRange);

    // update the color of the brush
    this.brushSelection.select('rect.selection')
      .attr('fill', this._options.userColor);

    this.svgSelection.select('g.brush rect.overlay').style('pointer-events', 'none');

    this.updateStreamGraph();
  }

  /**
   * called when the user performs a brush
   */
  private _brushed(): void {
    if (d3.event.sourceEvent === null) {
      return;
    }
    if (d3.event.sourceEvent && d3.event.sourceEvent.type === 'zoom') {
      return;
    } // ignore brush-by-zoom
    const s = d3.event.selection;
    this.lastBrush = s.map(this.timeScale.invert, this.timeScale);

    this.brushDebouncer.next(this.lastBrush);
  }

  private drawOtherBrushes() {
    if (!this.otherBrushesSelection || !this._otherBrushes || !this.timeScale) {
      return;
    }

    // console.log('draw other brushes', this._otherBrushes);

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

  private updateStreamGraph() {
    // console.log('try updating stream graph', this.streamGraph, this._streamGraphData, this._streamGraphColorScale);
    if (this.streamGraph && this._streamGraphData && this._streamGraphColorScale) {
      this.streamGraph.render(this._streamGraphData, this._streamGraphColorScale, this.width, this.height - 20, this.timeScale);
    }
  }
}
