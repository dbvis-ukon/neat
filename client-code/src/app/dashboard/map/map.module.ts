import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MapNeighborhoodsComponent} from '@app/dashboard/map/map-neighborhoods/map-neighborhoods.component';
import {MapProjectionService} from './map-projection.service';
import {MapTooltipComponent} from './map-tooltip/map-tooltip.component';
import {MapGlyphComponent} from '@app/dashboard/map/map-glyph/map-glyph.component';
import { MatProgressBarModule } from '@angular/material';

@NgModule({

  entryComponents: [
    MapTooltipComponent
  ],
  declarations: [
    MapNeighborhoodsComponent,
    MapGlyphComponent,
    MapTooltipComponent
  ],
  providers: [
    MapProjectionService
  ],
  imports: [
    CommonModule,
    MatProgressBarModule
  ],
  exports: [
    MapNeighborhoodsComponent,
    MapGlyphComponent
  ]
})
export class MapModule { }
