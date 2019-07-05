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
import { AngularResizedEventModule } from 'angular-resize-event';

import { DashboardComponent } from './dashboard/dashboard.component';
import { TimelineVisComponent } from './timeline-vis/timeline-vis.component';
import { EpisodeVisComponent } from './episode-vis/episode-vis.component';

import { SharedModule } from '@app/shared/shared.module';
import { MapModule } from '@app/dashboard/map/map.module';

@NgModule({
  declarations: [DashboardComponent, TimelineVisComponent, EpisodeVisComponent],
  imports: [
    CommonModule,
    AngularResizedEventModule,
    SharedModule.forRoot(),
    MatSliderModule,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MapModule
  ],
  exports: [DashboardComponent]
})
export class DashboardModule {}
