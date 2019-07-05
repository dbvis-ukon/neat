import {Injectable} from '@angular/core';
import {PixelPos} from '@shared/pixel-pos';
import {GeoPos} from '@shared/geo-pos';
import mapData from '@assets/map-data.json';
import {scaleLinear, ScaleLinear} from 'd3';

// This throws a circular dependency error. Therefore it is commented out and the service
// is defined in the providers array of the MapModule.
// @Injectable({
//   providedIn: MapModule
// })
export class MapProjectionService {
  private readonly scaleX: ScaleLinear<number, number>;
  private readonly scaleY: ScaleLinear<number, number>;

  constructor() {
    const {viewBox} = mapData.svg;

    this.scaleX = scaleLinear()
      .domain([-120, -119.711751])
      .range([viewBox.x, viewBox.x + viewBox.width]);
    this.scaleY = scaleLinear()
      .domain([0, 0.238585])
      .range([viewBox.y + viewBox.height, viewBox.y]);
  }

  public pixelsToGeo(position: PixelPos): GeoPos {
    return new GeoPos(
      this.scaleX.invert(position.x),
      this.scaleY.invert(position.y),
    );
  }

  public geoToPixels(position: GeoPos): PixelPos {
    return new PixelPos(
      this.scaleX(position.longitude),
      this.scaleY(position.latitude)
    );
  }
}

