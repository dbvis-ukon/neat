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
import {MapOptions} from '../map-options';
import {MapProjectionService} from '../map-projection.service';
import {MapGlyph} from './map-glyph';
import {Mc1Item} from '@shared';
import {PixelPos} from '@shared/pixel-pos';

interface SVGRenderGroups {
  baseLayer?: d3.Selection<SVGElement, {}, HTMLElement, any>;
  mc1glyph?: d3.Selection<SVGGElement, undefined, SVGElement, undefined>;
}

@Component({
  selector: 'dbvis-map-glyph-vis',
  templateUrl: './map-glyph.component.html',
  styleUrls: ['./map-glyph.component.less'],
  encapsulation: ViewEncapsulation.None
})
export class MapGlyphComponent implements OnInit {
  private static readonly INITIAL_WIDTH = 500.0;
  private static readonly INITIAL_HEIGHT = MapGlyphComponent.INITIAL_WIDTH / (mapData.svg.viewBox.width / mapData.svg.viewBox.height);

  @ViewChild('svg') svgRef: ElementRef;

  private svg: d3.Selection<SVGElement, null, undefined, null>;
  private svgRenderGroups: SVGRenderGroups = {};

  private _options: MapOptions;

  private _mc1Data: Mc1Item[];

  private mc1glyph: MapGlyph;

  constructor(private mapProjectionService: MapProjectionService) {
  }

  ngOnInit() {
    const {viewBox} = mapData.svg;

    this.svg = d3.select(this.svgRef.nativeElement);
    this.svg.attr('viewBox', `${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`);
    this.svg.attr('width', MapGlyphComponent.INITIAL_WIDTH);
    this.svg.attr('height', MapGlyphComponent.INITIAL_HEIGHT);

    this.svg.selectAll('*').remove();

    this.svgRenderGroups.baseLayer = this.svg.append('g').attr('id', 'layers');
    this.svgRenderGroups.mc1glyph = this.svg.append('g').attr('id', 'mc1-glyph');

    this.mc1glyph = new MapGlyph(
      this.svgRenderGroups.mc1glyph,
      this.mapProjectionService
    );

    this.draw();
  }

  onResized(event: ResizedEvent) {
    this.svg.attr('width', event.newWidth);
    this.svg.attr('height', event.newHeight);

    this.draw();
  }

  @Input()
  set options(options: MapOptions) {
    this._options = options;
    this.draw();
  }

  get options(): MapOptions {
    return this._options;
  }

  @Input()
  set mc1Data(mc1data: Mc1Item[]) {
    this._mc1Data = mc1data;
    this.draw();
  }

  get mc1Data(): Mc1Item[] {
    return this._mc1Data;
  }

  private draw(): void {
    this.drawBaseLayer();
    if (this.mc1glyph) {
      this.mc1glyph.render(this._mc1Data, this._options.timelineBrush);
    }
  }

  drawBaseLayer() {
    const baseLayerGroup = this.svgRenderGroups.baseLayer;
    if (!baseLayerGroup || !this._options) {
      return;
    }

    // Draw map layers in background
    baseLayerGroup.selectAll('*').remove();

    baseLayerGroup.selectAll('path.geo-element')
      .data(mapData.layers.filter(l => l.id === 'base')[0].paths)
      .enter()
      .append('path')
      .attr('d', d => d.d)
      .attr('style', d => {
        return d.styles.selected;
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
