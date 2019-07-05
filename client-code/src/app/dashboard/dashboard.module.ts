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

import { SharedModule } from '@app/shared/shared.module';
import { EpisodesModule } from './episodes/episodes.module';
import { MapModule } from '@app/dashboard/map/map.module';

@NgModule({
  declarations: [
    DashboardComponent,
    TimelineVisComponent,
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
    MatButtonModule,
    EpisodesModule,
    MapModule
  ],
  exports: [
    DashboardComponent,
    TimelineVisComponent
  ]
})
export class DashboardModule {}
