import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MapVisComponent } from './map-vis/map-vis.component';
import { TimelineVisComponent } from './timeline-vis/timeline-vis.component';
import { EpisodeVisComponent } from './episode-vis/episode-vis.component';
import { MatSliderModule } from '@angular/material';
import { AngularResizedEventModule } from 'angular-resize-event';
import { SharedModule } from '@app/shared/shared.module';

@NgModule({
  declarations: [
    DashboardComponent,
    MapVisComponent,
    TimelineVisComponent,
    EpisodeVisComponent,
  ],
  imports: [
    CommonModule,
    AngularResizedEventModule,
    SharedModule.forRoot(),
    MatSliderModule
  ],
  exports: [
    DashboardComponent
  ]
})
export class DashboardModule { }
