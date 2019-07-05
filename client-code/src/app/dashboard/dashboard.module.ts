import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSliderModule, MatSidenavModule, MatToolbarModule, MatListModule, MatIconModule, MatButtonModule } from '@angular/material';
import { AngularResizedEventModule } from 'angular-resize-event';

import { DashboardComponent } from './dashboard/dashboard.component';
import { MapVisComponent } from './map-vis/map-vis.component';
import { TimelineVisComponent } from './timeline-vis/timeline-vis.component';

import { SharedModule } from '@app/shared/shared.module';
import { EpisodesModule } from './episodes/episodes.module';

@NgModule({
  declarations: [
    DashboardComponent,
    MapVisComponent,
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
    EpisodesModule
  ],
  exports: [
    DashboardComponent,
    TimelineVisComponent
  ]
})
export class DashboardModule { }
