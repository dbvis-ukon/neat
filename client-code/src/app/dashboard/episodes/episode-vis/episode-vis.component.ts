import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  Input,
  ViewEncapsulation,
  Output,
  EventEmitter
} from '@angular/core';
import {
  isNullOrUndefined
} from 'util';
import {
  Episode
} from '../episode';
import {
  Line
} from '../line';
import * as d3 from 'd3';
import {
  EpisodeCalculatorService
} from '../episode-calculator.service';
import {
  Selection, ScaleTime, ScaleLinear
} from 'd3';
import { Observable } from 'rxjs';
import { TooltipService } from '@app/core/services/tooltip.service';
import { EpisodeTooltipComponent } from '../episode-tooltip/episode-tooltip.component';
import { UserOptionsRepositoryService } from '@app/core';
import { ResizedEvent } from 'angular-resize-event';

@Component({
  selector: 'dbvis-episode-vis',
  templateUrl: './episode-vis.component.html',
  styleUrls: ['./episode-vis.component.less'],
  encapsulation: ViewEncapsulation.None
})
export class EpisodeVisComponent implements OnInit {

  constructor(private tooltipService: TooltipService) {
  }


  private _hoverLine: Date = new Date();
  @Output()
  hoverLineChange: EventEmitter<Date> = new EventEmitter();

  @Input()
  get hoverLine(): Date {
    return this._hoverLine;
  }

  set hoverLine(value: Date) {
    this._hoverLine = value;
    this.updateHoverLine(true);
  }

  @Input()
  set episode(episodeObservable: Observable<Episode[]>) {
    if (isNullOrUndefined(episodeObservable)) {
      return;
    }

    episodeObservable.subscribe(episodes => {
      this._myEpisodes = episodes.filter(e => e.significance > 40);
      this.myEpisodes = this._myEpisodes;

      this.myEpisodes.forEach(d => {
        d.startTimestamp = new Date(d.startTimestamp);
        d.endTimestamp = new Date(d.endTimestamp);
        this.maxRow = Math.max(this.maxRow, d.rowIds[d.rowIds.length - 1]);
    });

      this.createOrUpdateVis();
      this.svgWidth = 100; // this.maxColumns * this.barWidth;
      this.translateG(this.svgWidth);
    });
  }

  @Input()
  set showText(showText: boolean) {
    this._showText = showText;

    if (showText) {
      this.svgWidth = this.maxColumns * this.barWidth + 400;
      this.paddingForLabels = 100;
      this.translateG(this.svgWidth);
      this.expandVis();
    } else {
      if (this.svg !== undefined) {
        this.svgWidth = this.maxColumns * this.barWidth;
        this.paddingForLabels = 0;
        this.translateG(this.svgWidth);
        this.compactVis();
        this.svgSelection.selectAll('.episodeToLabelLine').remove();
        this.svgSelection.selectAll('.episodeLabel').remove();
        this.svgSelection.selectAll('.episodeLine').remove();
      }
    }
  }

  get showText(): boolean {
    return this._showText;
  }

  @Input()
  set showHorizontally(showHorizontally: boolean) {
    this._showHorizontally = showHorizontally;

    if (!this.svgSelection) {
      return;
    }

    this.translateG(this.svgWidth);
  }

  get showHorizontally(): boolean {
    return this._showHorizontally;
  }

  onResized(event: ResizedEvent) {
    this.svgHeight = event.newWidth - 30;
    this.svgWidth = 100;//this.maxColumns * this.barWidth;
    this.translateG(0);
  }

  @ViewChild('svg') svgRef: ElementRef<SVGSVGElement>;

  /**
   * the svg element
   */
  private svg: SVGSVGElement;

  private svgSelection: Selection<SVGSVGElement, undefined, null, undefined>;

  private chartSelection: Selection<SVGGElement, undefined, null, undefined>;

  private hoverLineGroupSelection: d3.Selection<SVGGElement, null, undefined, null>;
  private hoverLineSelection: d3.Selection<SVGLineElement, null, undefined, null>;
  private hoverTextSelection: d3.Selection<SVGTextElement, null, undefined, null>;

  private numberOfSentences = 0;
  private svgWidth = 100; //// ToDo take the info about maxColumn
  private svgHeight = 0; // ToDo get width of parent container
  private oneTextElementHeight = 3; // ToDo change of the height of one sentence
  private paddingForLabels = 0;
  private barWidth = 3;
  private fontSize = 10;
  private maxColumns = 0;
  private maxRow = 0;
  private myScale: ScaleTime<number, number> = d3.scaleTime().domain([ new Date('2020-04-06 00:00:00'), new Date('2020-04-11 00:00:00')]);
  private episodeColumnScale: ScaleLinear<number, number> = d3.scaleLinear();
  private defaultHeight = 2000;


  // All episodes as originally received
  private _myEpisodes: Episode[] = [];
  // all episodes in the current timeline brush
  private myEpisodes: Episode[] = [];

  private sortedLabels = [];

  private _showText: boolean;

  private _showHorizontally: boolean;

  ngOnInit() {
    console.log('initialize');

    this.svg = this.svgRef.nativeElement;
    this.svgSelection = d3.select(this.svg);

    this.hoverLineGroupSelection = this.svgSelection
      .append('g')
      .attr('class', 'hoverLineGroup');
    this.hoverLineGroupSelection.append('rect')
      .attr('width', this.svgWidth)
      .attr('height', this.svgHeight)
      .attr('fill', 'none')
      .attr('pointer-events', 'all')
      .on('mousemove', () => {
        const mouseX = d3.mouse(this.svgSelection.node())[0];
        const t = this.myScale.invert(mouseX);
        this.hoverLineChange.emit(t);

        this.updateHoverLine(true);
      });


    this.chartSelection = this.svgSelection
      .append('g');

    this.createFirst();

    this.hoverLineSelection = this.svgSelection.append('line')
      .attr('y1', 0)
      .attr('y2', this.svgHeight)
      .attr('x1', 100)
      .attr('x2', 100)
      .attr('stroke-width', '2px')
      .attr('pointer-events', 'none')
      .attr('stroke', 'black');

    this.hoverTextSelection = this.svgSelection.append('text')
      .attr('y', 12)
      .attr('pointer-events', 'none')
      .style('font-size', '10px');

    // this.userOptionsService.userOptions$.subscribe(options => {
    //   // TODO filter stuff
    //   // console.log(options);
    //   const [minBrush, maxBrush] = options.timelineBrush;
    //   this.createOrUpdateVis();
    // });
  }

  // private applyTimelineBrush(brush?: [Date, Date]): Episode[] {
  //   if (!brush) {
  //     return this._myEpisodes;
  //   }
  //   const [minBrush, maxBrush] = brush;
  //   return this._myEpisodes.filter(episode => episode.)
  // }

  private createOrUpdateVis() {
    if (!this.svgSelection) {
      return;
    }

    /*first sort episodes according to their occurrence in text*/
    this.reorderEpisodeBarsHorizontally(this.myEpisodes, 100000); // this.numberOfSentences); //sort horizontally
    this.episodeColumnScale.domain([0, this.maxColumns]);
    this.myEpisodes = this.sortEpisodes(this.myEpisodes); // sort vertically (to determine the correct order of labels)

    this.createEpisodeBars(this.myEpisodes, this.numberOfSentences);

    /* create small lines on top of the episode bars to show where exactly they occur in text */
    const lineData = this.getLineData(this.myEpisodes);
    // this.createEpisodeLines(lineData);
    // this.updateEpisodeLines(lineData);
    // if(this._showHorizontally){
    //   this.svgSelection.select('#gContainerForEpisodeBars')
    //   .attr('transform', 'rotate(90)');
    // }
  }

  private expandVis() {

    /* create labels */
    this.update();
    // const lineData = this.getLineData(this.myEpisodes);
    // this.updateEpisodeLines(lineData);

    const labels = this.getLabelData(this.myEpisodes);
    this.sortedLabels = this.unOverlapEpisodeLabelNodes(labels, this.fontSize);
    this.createLabels(this.myEpisodes);
    this.updateEpisodeLabels(this.myEpisodes);

    /* create lines to link episode bars to their labels */
    this.createEpisodeToLabelConnectingLine(this.myEpisodes);
    this.updateEpisodeToLabelConnectingLine(this.myEpisodes);
  }

  private compactVis() {
    /* create labels */
    this.update();
  }

  // *******************************************************************
  // helper functions **************************************************
  // *******************************************************************
  // sort episode bars, code taken from Christopher Rohrdantz
  // episode must contain globalUtteranceIndexesForWords
  private reorderEpisodeBarsHorizontally(episodes: Episode[], numberOfSentences: number): void {
    const layoutPositions = [];

    for (let i = 0; i < numberOfSentences; i++) {
      layoutPositions.push([]);
    }

    episodes.forEach((episode) => {
      let globalUtteranceIndexesForWords: number[] = []; // episode.rowIndexesForSentences;
      // globalUtteranceIndexesForWords.push(episode.startSentence);
      // globalUtteranceIndexesForWords.push(episode.endSentence);
      globalUtteranceIndexesForWords = episode.rowIds;
      const firstRowPosition = globalUtteranceIndexesForWords[0];
      const lastRowPosition = globalUtteranceIndexesForWords[globalUtteranceIndexesForWords.length - 1];

      /* get the leftmost position not occupied by any of the previous episodes - this could be complex*/
      let leftmostNotOccupied = 0;
      /* needed in loop*/
      let tmpRow = [];
      /* iterate over all*/
      for (let k = firstRowPosition; k <= lastRowPosition; k++) {
        /* 1. case: position has not been occupied, yet*/
        if (layoutPositions[k] === undefined) {
          layoutPositions[k].push([]);
        } else {
          tmpRow = layoutPositions[k];
          /* search for 0*/
          let emptySpot = false;
          /* go from low to high (left to right) and search the first unoccupied bin*/
          /* does not have to start from 0, when a higher position has already been found as occupied in a previous row.*/
          let m = leftmostNotOccupied;
          while (!emptySpot && (m < tmpRow.length)) {
            if (tmpRow[m] === -1) {
              emptySpot = true;
            }
            m++;
          }
          /* if it contains a -1, take the position of the -1*/
          if (emptySpot) {
            leftmostNotOccupied = Math.max(leftmostNotOccupied, m);
          } else {
            leftmostNotOccupied = Math.max(leftmostNotOccupied, tmpRow.length);
          }

        }
      }

      /* mark the part of the column assigned to this episode as occupied (in the episodeLayout)*/
      this.setColumnPartOccupied(layoutPositions, leftmostNotOccupied, firstRowPosition, lastRowPosition);

      /* create a position object for this episode*/
      episode.columnId = leftmostNotOccupied;
      episode.rowIds = globalUtteranceIndexesForWords;
      this.maxColumns = Math.max(this.maxColumns, leftmostNotOccupied);

    });
  }

  private initializeEpisodeBars() {
    this.svgSelection
      .append('g')
      .attr('id', 'gContainerForEpisodeBars');
  }

  private translateG(x: number) {
    if (this._showHorizontally) {
      this.myScale
      .range([0, this.svgHeight]);

      this.episodeColumnScale.range([0, this.svgWidth]);

      this.svgSelection
        .attr('height', this.svgWidth)
        .attr('width', this.svgHeight)
        .select('#gContainerForEpisodeBars')
        .attr('transform', `rotate(-90 50 50)`);

      // update hoverline rect width / height
      this.hoverLineGroupSelection.select('rect')
        .attr('width', this.svgHeight)
        .attr('height', this.svgWidth);
      this.hoverLineSelection
        .attr('y1', 0)
        .attr('y2', this.svgWidth);

      this.update();
    } else {
      this.svgHeight = this.defaultHeight;
      this.myScale
      .range([0, this.svgHeight]);

      this.episodeColumnScale.range([0, this.svgWidth]);

      this.svgSelection
      .attr('height', this.svgHeight)
      .attr('width', this.svgWidth)
      .select('#gContainerForEpisodeBars')
      .attr('transform', `rotate(0)translate(${2 * x / 3}, 0)`);

      // update hoverline rect width / height
      this.hoverLineGroupSelection.select('rect')
        .attr('width', this.svgWidth)
        .attr('height', this.svgHeight);
      this.hoverLineSelection
        .attr('y1', 0)
        .attr('y2', this.svgHeight);


      // this.update();
      // .attr('transform', 'translate(' + (x / 0.1) + ', 0)');
    }
  }

  private createEpisodeBars(episodes: Episode[], numberOfSentences: number): void {
    if (!this.svgSelection) {
      return;
    }
    // add episodes
    // attributes for episode: id, columnId, rowIds, color
    this.svgSelection.select('#gContainerForEpisodeBars')
      .selectAll('rect')
      .data<Episode>(episodes)
      .enter()
      .append('rect')
      .attr('class', 'episodeBar')
      .attr('id', (d) => d.id)
      .style('fill', (d) => 'rgb(' + d.color + ')')
      .on('mouseenter', (d) => {
        const mouseEvent: MouseEvent = d3.event;

        const episodeTooltipComponentInstance = this.tooltipService.openAtMousePosition(EpisodeTooltipComponent, mouseEvent);

        episodeTooltipComponentInstance.utterances = d.utterances;

        this.svgSelection.select('#gContainerForEpisodeBars').select('#label' + d.id).classed('bold', true);

      })
      .on('mouseleave', (d) => {
        this.tooltipService.close();
        this.svgSelection.select('#gContainerForEpisodeBars').select('#label' + d.id).classed('bold', false);
      })
      .on('mousemove', () => {
        const mouse = d3.mouse(this.svgSelection.node());
        const x = this.myScale.invert(mouse[0]);
        this.hoverLineChange.emit(x);
      });

    this.update();
    // console.log(this._utterance);
  }

  private createFirst(): void {
    this.createSVG();
    this.initializeEpisodeBars();
  }

  private createSVG(): void {
    this.svgSelection
      .attr('width', this.svgWidth)
      .attr('height', this.svgHeight)
      .attr('id', 'episodesSVG')
      .attr('class', 'episode-vis');
  }

  // private initializeUtterances(): void {
  //   this.svgSelection
  //     .append('foreignObject')
  //     .attr('x', this.svgWidth / 2)
  //     .attr('y', this.paddingHeight)
  //     .attr('width', this.svgWidth / 2)
  //     .attr('height', this.svgHeight / 2)
  //     .append('xhtml:div')
  //     .attr('id', 'utteranceDivForEpisodes');
  // }

  // private updateUtterance(utterance: Utterance): void {
  //   console.log(utterance);
  //   const div = d3.select('#utteranceDivForEpisodes')
  //     .append('div')
  //     .attr('id', `utterance${utterance.id.counter}`);

  //   utterance.sentences.forEach((sentence) => {
  //     div.append('div')
  //       .attr('class', 'utterance-sentence')
  //       .text(sentence.text);
  //   });
  // }


  // private updateEpisodeBars(episodes: Episode[]): void {
  //   d3.selectAll('.episodeBar').data(episodes);
  //   this.update();
  // }


  private update(): void {

    this.svgSelection.selectAll<SVGRectElement, Episode>('.episodeBar')
      .attr('x', (d) => d.columnId * this.barWidth)// this.episodeColumnScale(d.columnId))//
      .attr('y', (d) => this.myScale(d.startTimestamp))
      .attr('height', (d) => this.myScale(d.endTimestamp) - this.myScale(d.startTimestamp))
      .attr('width', (d) => this.barWidth)// this.episodeColumnScale(1) - this.episodeColumnScale(0))//
      .style('fill', (d) => d.color);


    // bars.exit().remove();
  }

  private createEpisodeLines(lines: Line[]): void {
    this.svgSelection.select('#gContainerForEpisodeBars')
      .selectAll('.episodeLine').remove();
    this.svgSelection.select('#gContainerForEpisodeBars')
      .selectAll('.episodeLine')
      .data(lines)
      .enter()
      .append('line')
      .attr('class', 'episodeLine');
  }

  private updateEpisodeLines(lines: Line[]): void {
    this.svgSelection.select('#gContainerForEpisodeBars')
      .selectAll('.episodeLine')
      .data(lines)
      .attr('x1', (d) => d.x1)
      .attr('y1', (d) => d.y1)
      .attr('x2', (d) => d.x2)
      .attr('y2', (d) => d.y2)
      .style('stroke', 'black')
      .style('stroke-width', 1);
  }

  private createLabels(episodes: Episode[]): void {
    this.svgSelection.selectAll('.episodeLabel').remove();
    this.svgSelection.select('#gContainerForEpisodeBars')
      .selectAll('text')
      .data<Episode>(episodes)
      .enter()
      .append('text')
      .text((d) => {
        if (d.lemma.length < 50) {
          return d.lemma;
        } else {
          return d.lemma.substring(0, 50) + '...';
        }
      })
      .attr('class', 'episodeLabel')
      .attr('id', (d) => 'label' + d.id)
      .style('font-size', this.fontSize);
  }


  private updateEpisodeLabels(episodes: Episode[]): void {
    this.svgSelection.select('#gContainerForEpisodeBars')
      .selectAll('.episodeLabel')
      .data<Episode>(episodes)
      .attr('x', () => -200)
      .attr('y', (d, i) => this.sortedLabels[i])
      .style('font-size', this.fontSize);
  }

  private createEpisodeToLabelConnectingLine(episodes: Episode[]): void {
    this.svgSelection.select('#gContainerForEpisodeBars')
      .selectAll('.episodeToLabelLine')
      .data(episodes)
      .enter()
      .append('line')
      .attr('class', 'episodeToLabelLine');
  }

  private updateEpisodeToLabelConnectingLine(episodes: Episode[]): void {
    this.svgSelection.select('#gContainerForEpisodeBars')
      .selectAll('.episodeToLabelLine')
      .data<Episode>(episodes)
      .attr('x1', this.fontSize * 4 - 200)
      .attr('y1', (d, i) => this.sortedLabels[i])
      .attr('x2', (d) => (this.barWidth * d.columnId))
      .attr('y2', (d) => this.myScale(d.startTimestamp) + 2)
      .style('stroke', 'black')
      .style('stroke-width', 0.2);
  }

  private setColumnPartOccupied(episodeLayout, leftmostNotOccupied, firstRowPosition, lastRowPosition): void {
    let tmpRow = [];

    for (let k = firstRowPosition; k <= lastRowPosition; k++) {
      tmpRow = episodeLayout[k];
      /* row not long enough?*/
      while (tmpRow.length < (leftmostNotOccupied + 1)) {
        tmpRow.push(-1);
      }

      /* now it is long enough, set the value at the occupied index*/
      tmpRow[leftmostNotOccupied] = 1;
      /* save the altered row*/
      episodeLayout[k] = tmpRow;
    }
  }

  private getLabelData(episodes: Episode[]): any[] {
    const labels = [];
    episodes.forEach((episode) => {
      labels.push(this.myScale(episode.startTimestamp)); // episode.rowIds[0] * this.oneTextElementHeight);
    });
    return labels;
  }

  private unOverlapEpisodeLabelNodes(allLabels, height: number): any {
    /**
     * if after a certain iteration no shift had been necessary,
     * break
     */
    let shiftHappened = true;
    while (shiftHappened) {
      shiftHappened = false;
      for (let i = 0; i < (allLabels.length - 1); i++) {

        const firstLabel = allLabels[i];
        const secondLabel = allLabels[i + 1];

        /** check overlap */
        const overlap = firstLabel + height - secondLabel;

        /**
         * half of the number of pixels that should be in
         * between
         */
        const halfOfShiftGap = 1;
        /** if there really is an overlap, the value is positive */
        if (overlap >= 0) {
          shiftHappened = true;
          /**
           * shift the first label upwards by a little more
           * than half of the overlap
           */
          allLabels[i] = firstLabel - 0.5 *
            overlap - halfOfShiftGap;
          /**
           * shift the second label downwards by a little more
           * than half of the overlap
           */
          allLabels[i + 1] = secondLabel + 0.5 *
            overlap + halfOfShiftGap;
        }
      }
    }
    return allLabels;
  }

  private getLineData(episodes: Episode[]): Line[] {
    const that = this;
    const linesData = [];
    episodes.forEach((episode) => {
      episode.rowIds.forEach((row, i) => {
        linesData.push({
          x1: that.paddingForLabels + (that.svgWidth / 3) - (that.barWidth * episode.columnId),
          x2: that.paddingForLabels + (that.svgWidth / 3) - (that.barWidth * episode.columnId - that.barWidth),
          y1: row * that.oneTextElementHeight,
          y2: row * that.oneTextElementHeight
        });
      });
    });
    return linesData;
  }

  private sortEpisodes(episodes) {
    return episodes.sort(this.compareBasedOnPosition);
  }

  private compareBasedOnPosition(a, b) {
    if (a.rowIds[0] < b.rowIds[0]) {
      return -1;
    }
    if (a.rowIds[0] > b.rowIds[0]) {
      return 1;
    }
    return 0;
  }

  private updateHoverLine(showText = true): void {
    if (this._hoverLine === undefined) {
      return;
    }

    const x = this.myScale(this._hoverLine);

    if (!this.hoverLineSelection) {
      return;
    }

    this.hoverLineSelection
      .attr('x1', x)
      .attr('x2', x);

    const timeFormat = d3.timeFormat('%Y-%m-%d %H:%M:%S');

    const txt = showText && this._hoverLine ? timeFormat(this._hoverLine) : '';
    const txtX = x < (this._showHorizontally ? this.svgHeight : this.svgWidth) / 2 ? x + 2 : x - 122;

    this.hoverTextSelection
      .attr('x', txtX)
      .text(txt);
  }
}
