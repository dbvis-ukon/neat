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
import {UserOptionsRepositoryService} from "@app/core";

@Component({
  selector: 'dbvis-episode-timeline',
  templateUrl: './episode-timeline.component.html',
  styleUrls: ['./episode-timeline.component.less'],
  encapsulation: ViewEncapsulation.None
})
export class EpisodeTimelineComponent implements OnInit {

  @ViewChild('svg') svgRef: ElementRef<SVGElement>;

  private _data: Timelinedata[] = [];
  private data: Timelinedata[] = [];

  private svg: SVGElement;
  private svgSelection: Selection<SVGElement, undefined, null, undefined>;
  private chartSelection: Selection<SVGGElement, undefined, null, undefined>;

  private svgWidth = 400; // ToDo take the info about maxColumn
  private svgHeight = 2200;
  private paddingHeight = 50;
  private timelinePadding = 50;
  private lineHeight = 0.3;

  constructor(private tooltipService: TooltipService,
              private userOptionsService: UserOptionsRepositoryService) {
  }

  ngOnInit() {
    this.svg = this.svgRef.nativeElement;
    this.svgSelection = d3.select(this.svg);

    this.svgSelection
      .style('margin-top', -this.svgHeight)
      .attr('height', this.svgHeight + 50)
      .attr('width', this.svgWidth);

    this.chartSelection = this.svgSelection
      .append('g');

    this.userOptionsService.userOptions$.subscribe(options => {
      console.log('updating');
      this.data = this.applyTimelineBrush(options.timelineBrush);
      console.log(this.data);
      this.update();
    });
  }


  @Input()
  set timelineData(timelineDataObservable: Observable<Timelinedata[]>) {
    if (isNullOrUndefined(timelineDataObservable)) {
      return;
    }

    timelineDataObservable.subscribe(timelineData => {
      this._data = timelineData.sort((a, b) => {
        return +a.datetime - +b.datetime;
      });
      const first = new Timelinedata(null, null, this._data[0]);
      first.count = 0;
      const last = new Timelinedata(null, null, this._data[this._data.length - 1]);
      last.count = 0;
      this._data.push(last);
      this._data.unshift(first);

      this.data = this.applyTimelineBrush();

      this.update();
    });
  }

  private applyTimelineBrush(brush?: [Date, Date]): Timelinedata[] {
    if (!brush) {
      return this._data;
    }

    const [minBrush, maxBrush] = brush;
    console.log(minBrush, maxBrush);
    const filtered = this._data.filter(data => {
      return data.datetime >= minBrush && data.datetime <= maxBrush;
    });
    if (filtered.length > 0) {
      const first = new Timelinedata(null, null, filtered[0]);
      first.count = 0;
      const last = new Timelinedata(null, null, filtered[filtered.length - 1]);
      last.count = 0;
      filtered.push(last);
      filtered.unshift(first);
    }

    console.log(filtered);

    return filtered;
  }

  private yAccessor(d: Timelinedata): Date {
    return d.datetime;
  }

  private xAccessor(d: Timelinedata): number {
    return d.count;
  }

  private update() {
    console.log(this.data);
    if (this.data.length === 0) {
      console.warn('no data in timeline');
      return;
    }
    const [min, max] = d3.extent(this.data, this.yAccessor);
    console.log(min, max);
    const timeDiff = (max.valueOf() - min.valueOf()) / 1000 / 60;

    const yScale = d3.scaleTime()
      .domain([min, max])
      .range([this.paddingHeight, this.lineHeight * timeDiff]);

    console.log(d3.extent(this.data, this.xAccessor));
    const xScale = d3.scaleLinear()
      .domain(d3.extent(this.data, this.xAccessor))
      .range([this.svgWidth - this.timelinePadding, this.svgWidth - (200 + this.timelinePadding)]);

    const line = d3.line<Timelinedata>()
      .x(d => xScale(this.xAccessor(d)))
      .y(d => yScale(this.yAccessor(d)))
      .curve(d3.curveBasis);

    const bisector = d3.bisector<Timelinedata, Date>(d => d.datetime).left;

    this.chartSelection.selectAll('*').remove();

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
      .attr('transform', `translate(${this.svgWidth - this.timelinePadding}, 0)`)
      .call(d3.axisRight(yScale)); // Create an axis component with d3.axisLeft
  }

}
