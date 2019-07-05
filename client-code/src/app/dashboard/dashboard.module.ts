import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatButtonModule,
  MatIconModule,
  MatListModule,
  MatSidenavModule,
  MatSliderModule,
  MatToolbarModule
} from '@angular/material';

import { DashboardComponent } from './dashboard/dashboard.component';
import { TimelineVisComponent } from './timeline-vis/timeline-vis.component';
import { EpisodeVisComponent } from './episode-vis/episode-vis.component';

import { SharedModule } from '@app/shared/shared.module';
import { StreamgraphTooltipComponent } from './timeline-vis/streamgraph-tooltip/streamgraph-tooltip.component';
import { MapModule } from '@app/dashboard/map/map.module';

@NgModule({
  entryComponents: [
    StreamgraphTooltipComponent
  ],
  imports: [
    CommonModule,
    SharedModule.forRoot(),
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatSidenavModule,
    MatSliderModule,
    MatToolbarModule,
    MapModule
  ],
  declarations: [
    DashboardComponent,
    TimelineVisComponent,
    EpisodeVisComponent,
    StreamgraphTooltipComponent,
  ],
  exports: [DashboardComponent]
})
export class DashboardModule {}
