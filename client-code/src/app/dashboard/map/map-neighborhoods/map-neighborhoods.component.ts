import {
  Component,
  ElementRef, EventEmitter,
  Input,
  OnInit, Output,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import {ResizedEvent} from 'angular-resize-event';
import * as d3 from 'd3';
import mapData from '@assets/map-data.json';
import neighborhoodData from '@assets/neighborhood-data.json';
import {MapOptions} from '../map-options';
import {MapProjectionService} from '../map-projection.service';
import {PixelPos} from '@shared/pixel-pos';
import {NeighborhoodSelection} from '@shared/neighborhood-selection';
import {MapTooltipComponent} from '@app/dashboard/map/map-tooltip/map-tooltip.component';
import {TooltipService} from '@app/core/services/tooltip.service';
import {Mc2RadiationItem} from '../mc2-radiation-item';

interface SVGRenderGroups {
  layers?: d3.Selection<SVGElement, {}, HTMLElement, any>;
  radiation?: d3.Selection<SVGElement, {}, HTMLElement, any>;
  eventCatchers?: d3.Selection<SVGElement, {}, HTMLElement, any>;
}

interface AggregatedStaticRadiationItem {
  sensorId: string;
  latitude: number;
  longitude: number;
  meanValue: number;
  summedValue: number;
  valueCount: number;
}

@Component({
  selector: 'dbvis-map-neighborhood-vis',
  templateUrl: './map-neighborhoods.component.html',
  styleUrls: ['./map-neighborhoods.component.less'],
  encapsulation: ViewEncapsulation.None
})
export class MapNeighborhoodsComponent implements OnInit {
  private static readonly INITIAL_WIDTH = 300.0;
  private static readonly INITIAL_HEIGHT = MapNeighborhoodsComponent.INITIAL_WIDTH
    / (mapData.svg.viewBox.width / mapData.svg.viewBox.height);

  @Output()
  public selected: EventEmitter<NeighborhoodSelection> = new EventEmitter();

  @ViewChild('svg') svgRef: ElementRef;

  private svg: d3.Selection<SVGElement, null, undefined, null>;
  private svgRenderGroups: SVGRenderGroups = {};
  private geoElementSelection: d3.Selection<SVGPathElement, any, SVGGElement, any>;

  private _options: MapOptions;
  private aggregatedStaticRadiationData: AggregatedStaticRadiationItem[];
  private mobileRadiationData: Mc2RadiationItem[];
  private neighborhoodSelection: NeighborhoodSelection = {};

  constructor(private mapProjectionService: MapProjectionService, private tooltipService: TooltipService) {
    Object.keys(neighborhoodData).map(l => {
      this.neighborhoodSelection[l] = false;
    });
  }

  ngOnInit() {
    const {viewBox} = mapData.svg;

    this.svg = d3.select(this.svgRef.nativeElement);
    this.svg.attr('viewBox', `${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`);
    this.svg.attr('width', MapNeighborhoodsComponent.INITIAL_WIDTH);
    this.svg.attr('height', MapNeighborhoodsComponent.INITIAL_HEIGHT);

    this.svg.selectAll('*').remove();

    this.svgRenderGroups.layers = this.svg.append('g').attr('id', 'layers');
    this.svgRenderGroups.radiation = this.svg.append('g').attr('id', 'radiation');
    this.svgRenderGroups.eventCatchers = this.svg.append('g').attr('id', 'event-catchers');

    this.draw();
  }

  onResized(event: ResizedEvent) {
    this.svg.attr('width', event.newWidth);
    this.svg.attr('height', event.newHeight);

    this.draw();
  }

  @Input()
  set radiationData(radiationData: Mc2RadiationItem[]) {

    this.mobileRadiationData = radiationData.filter(d => d.type === 'mobile');
    const staticRadiationData = radiationData.filter(d => d.type === 'static');

    const groupedStaticRadiationData = d3.nest()
      .key((d: Mc2RadiationItem) => d.sensorId)
      .entries(staticRadiationData);

    const aggregatedPerGroup = groupedStaticRadiationData.map(g => {
      const items = g.values;

      const valueSum = items.reduce((sum, curr) => {
        return sum + curr.value;
      }, 0);

      return {
        sum: valueSum,
        mean: valueSum / items.length,
        count: items.length
      };
    });

    this.aggregatedStaticRadiationData = groupedStaticRadiationData.map((g, idx) => {
      const firstItem: Mc2RadiationItem = g.values[0];
      const aggregation = aggregatedPerGroup[idx];

      return {
        sensorId: firstItem.sensorId,
        latitude: firstItem.latitude,
        longitude: firstItem.longitude,
        meanValue: aggregation.mean,
        summedValue: aggregation.sum,
        valueCount: aggregation.count,
      };
    });

    this.drawRadiationData();
  }

  @Input()
  set options(options: MapOptions) {
    this._options = options;
    this.draw();
  }

  get options(): MapOptions {
    return this._options;
  }

  private draw(): void {
    this.drawLayers();
    this.drawRadiationData();
    this.drawEventCatchers();
  }

  drawRadiationData() {

    const radiationGroup = this.svgRenderGroups.radiation;
    if (!radiationGroup) {
      return;
    }

    radiationGroup.selectAll('*').remove();

    const mobileRadiationGroup = radiationGroup.append('g')
      .attr('class', 'mobile-radiation');

    const staticRadiationGroup = radiationGroup.append('g')
      .attr('class', 'static-radiation');

    /* If overplotting is solved, change this to opacity scale! */
    const radiationColor = (t) => d3.interpolateReds(d3.scaleLinear()
      .domain([0, 72.3147833333])
      .range([0, 1])(t));

    mobileRadiationGroup.selectAll('circle.radiation-glyph')
      .data(this.mobileRadiationData)
      .enter()
      .append('circle')
      .attr('class', 'radiation-glyph')
      .attr('r', 5)
      .each((d, i, n) => {
        const pixPos = this.mapProjectionService.geoToPixels(d);
        const node = d3.select(n[i]);
        node.attr('cx', pixPos.x);
        node.attr('cy', pixPos.y);
      })
      .style('fill', d => radiationColor(d.value));

    staticRadiationGroup.selectAll('circle.radiation-glyph')
      .data(this.aggregatedStaticRadiationData)
      .enter()
      .append('circle')
      .attr('class', 'radiation-glyph')
      .attr('r', 50)
      .each((d, i, n) => {
        const pixPos = this.mapProjectionService.geoToPixels(d);
        const node = d3.select(n[i]);
        node.attr('cx', pixPos.x);
        node.attr('cy', pixPos.y);
      })
      .style('fill', d => radiationColor(d.meanValue))
      .style('stroke', d3.interpolateReds(1))
      .style('stroke-width', '20px');


  }

  drawLayers() {
    const layersGroup = this.svgRenderGroups.layers;
    if (!layersGroup || !this._options) {
      return;
    }

    // Draw map layers in background
    layersGroup.selectAll('*').remove();

    const geoLayers = layersGroup.selectAll('g.geo-layer')
      .data(mapData.layers.sort((l1, l2) => l1.index - l2.index))
      .enter()
      .append('g')
      .filter(l => l.id !== 'names')
      .attr('class', 'geo-layer')
      .attr('id', d => d.id);

    const geoElementSelection = geoLayers.selectAll('path.geo-element')
      .data(d => d.paths)
      .enter()
      .append('path')
      .attr('class', (d, i, n) => {
        const parentNode = d3.select(n[i].parentNode);
        const parentData: any = parentNode.datum();
        return `geo-element ${parentData.id}`;
      })
      .attr('id', d => d.svgId)
      .attr('d', d => d.d);

    this.geoElementSelection = geoElementSelection;

    this.setLayerStyles();
  }

  setLayerStyles() {
    const {geoElementSelection, neighborhoodSelection} = this;

    geoElementSelection.attr('style', d => {
      return neighborhoodSelection[d.index] ? d.styles.selected : d.styles.unselected;
    });
  }

  drawEventCatchers() {
    const {neighborhoodSelection} = this;
    const eventCatchersGroup = this.svgRenderGroups.eventCatchers;
    if (!eventCatchersGroup || !this._options) {
      return;
    }

    // Draw map layers in background
    eventCatchersGroup.selectAll('*').remove();

    eventCatchersGroup.selectAll('path.event-catcher')
      .data(mapData.layers.filter(l => l.id === 'base')[0].paths)
      .enter()
      .append('path')
      .attr('class', 'event-catcher')
      .attr('id', d => `event-catcher_d.index`)
      .attr('d', d => d.d)
      .attr('data-neighborhood-id', d => d.index)
      .attr('style', 'stroke:none;fill:rgba(255,255,255,0);')
      .on('mouseenter', d => {
        const e: MouseEvent = d3.event;

        const nh = neighborhoodData[d.index];

        const mapTooltipInstance = this.tooltipService.openAtMousePosition(MapTooltipComponent, e);
        mapTooltipInstance.name = nh.name;
        mapTooltipInstance.index = d.index;
        mapTooltipInstance.color = `rgba(${nh.color.red}, ${nh.color.green}, ${nh.color.blue}, 0.9)`;
      })
      .on('mousemove', d => {
        const e: MouseEvent = d3.event;
        this.tooltipService.openAtMousePosition(MapTooltipComponent, e);
      })
      .on('mouseleave', d => {
        this.tooltipService.close();
      })
      .on('click', d => {

        neighborhoodSelection[d.index] = !neighborhoodSelection[d.index];
        this.selected.emit(neighborhoodSelection);
        this.setLayerStyles();

        // const e: MouseEvent = d3.event;
        // console.log(`Neighborhood with ID = ${d.index} `
        //   + `clicked at SVG-position (${this.clientPosToSVGPos(new PixelPos(e.clientX, e.clientY))}).`);
      });
  }

  clientPosToSVGPos(pos: PixelPos): PixelPos {
    const svg: any = this.svg.node();

    const pt = svg.createSVGPoint();
    pt.x = pos.x;
    pt.y = pos.y;

    const cursorpt = pt.matrixTransform(svg.getScreenCTM().inverse());

    console.log(cursorpt);

    return new PixelPos(cursorpt.x, cursorpt.y);
  }
}
