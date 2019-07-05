import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSliderModule, MatSidenavModule, MatToolbarModule, MatListModule, MatIconModule, MatButtonModule } from '@angular/material';
import { AngularResizedEventModule } from 'angular-resize-event';

import { DashboardComponent } from './dashboard/dashboard.component';
import { MapVisComponent } from './map-vis/map-vis.component';
import { TimelineVisComponent } from './timeline-vis/timeline-vis.component';
import { EpisodeVisComponent } from './episode-vis/episode-vis.component';

import { SharedModule } from '@app/shared/shared.module';
import { StreamgraphTooltipComponent } from './timeline-vis/streamgraph-tooltip/streamgraph-tooltip.component';

@NgModule({
  entryComponents:[
    StreamgraphTooltipComponent
  ],
  declarations: [
    DashboardComponent,
    MapVisComponent,
    TimelineVisComponent,
    EpisodeVisComponent,
    StreamgraphTooltipComponent,
  ],
  imports: [
    CommonModule,
    AngularResizedEventModule,
    SharedModule.forRoot(),
    MatSliderModule,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatIconModule,
    MatButtonModule
  ],
  exports: [
    DashboardComponent
  ]
})
export class DashboardModule { }
