import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  Input,
  ViewEncapsulation
} from '@angular/core';
import {
  isNullOrUndefined
} from 'util';
import * as d3 from 'd3';
import {
  Selection
} from 'd3';
import {Observable} from 'rxjs';
import {TooltipService} from '@app/core/services/tooltip.service';
import {Timelinedata} from '@app/dashboard/episodes/timelinedata';
import {EpisodeTimelineTooltipComponent} from '@app/dashboard/episodes/episode-timeline-tooltip/episode-timeline-tooltip.component';
import {buildAnimationTimelines} from "@angular/animations/browser/src/dsl/animation_timeline_builder";

@Component({
  selector: 'dbvis-episode-timeline',
  templateUrl: './episode-timeline.component.html',
  styleUrls: ['./episode-timeline.component.less'],
  encapsulation: ViewEncapsulation.None
})
export class EpisodeTimelineComponent implements OnInit {

  @ViewChild('svg') svgRef: ElementRef<SVGElement>;

  private data: Timelinedata[] = [];

  private svg: SVGElement;
  private svgSelection: Selection<SVGElement, undefined, null, undefined>;
  private chartSelection: Selection<SVGGElement, undefined, null, undefined>;

  private svgWidth = 400; // ToDo take the info about maxColumn
  private svgHeight = 2200;
  private paddingHeight = 50;
  private timelinePadding = 50;

  private that = this;

  constructor(private tooltipService: TooltipService) {
  }

  ngOnInit() {
    console.log('initialize');

    this.svg = this.svgRef.nativeElement;
    this.svgSelection = d3.select(this.svg);

    this.svgSelection
      .style('margin-top', -this.svgHeight)
      .attr('height', this.svgHeight + 50)
      .attr('width', this.svgWidth);

    this.chartSelection = this.svgSelection
      .append('g');
  }


  @Input()
  set timelineData(timelineDataObservable: Observable<Timelinedata[]>) {
    if (isNullOrUndefined(timelineDataObservable)) {
      return;
    }

    timelineDataObservable.subscribe(timelineData => {
      this.data = timelineData.sort((a, b) => {
        return +a.datetime - +b.datetime;
      });
      const first = new Timelinedata(null, null, this.data[0]);
      first.count = 0;
      const last = new Timelinedata(null, null, this.data[this.data.length - 1]);
      last.count = 0;
      this.data.push(last);
      this.data.unshift(first);
      this.update(this);
    });
  }

  private yAccessor(d: Timelinedata): Date {
    return d.datetime;
  }

  private xAccessor(d: Timelinedata): number {
    return d.count;
  }

  private update(that) {
    const yScale = d3.scaleTime()
      .domain(d3.extent(this.data, this.yAccessor))
      .range([this.paddingHeight, this.svgHeight]);

    const xScale = d3.scaleLinear()
      .domain(d3.extent(this.data, this.xAccessor))
      .range([this.svgWidth - this.timelinePadding, this.svgWidth - (200 + this.timelinePadding)]);

    const line = d3.line<Timelinedata>()
      .x(d => xScale(this.xAccessor(d)))
      .y(d => yScale(this.yAccessor(d)))
      .curve(d3.curveBasis);

    const bisector = d3.bisector<Timelinedata, Date>(d => d.datetime).left;

    this.chartSelection.append('path')
      .attr('fill', 'lightblue')
      .attr('stroke', 'steelblue')
      .attr('stroke-width', 1)
      .attr('d', line(this.data))
      .on('mousemove', d => {
        const t = yScale.invert(d3.mouse(this.chartSelection.node())[1]);
        const i = bisector(this.data, t, 1);
        const dataPoint = this.data[i];

        const mouseEvent: MouseEvent = d3.event;
        const episodeTimelineTooltipComponent = this.tooltipService.openAtMousePosition(EpisodeTimelineTooltipComponent, mouseEvent);

        episodeTimelineTooltipComponent.date = dataPoint.datetime;
        episodeTimelineTooltipComponent.count = dataPoint.count;
      })
      .on('mouseleave', () => {
        this.tooltipService.close();
      })
    ;

    this.chartSelection.append('g')
      .attr('class', 'x axis')
      .attr('transform', `translate(0, ${this.paddingHeight})`)
      .call(d3.axisTop(xScale)); // Create an axis component with d3.axisBottom

    this.chartSelection.append('g')
      .attr('class', 'y axis')
      .attr('transform', `translate(${this.svgWidth - this.timelinePadding}, ${this.paddingHeight})`)
      .call(d3.axisRight(yScale)); // Create an axis component with d3.axisLeft
  }

}
