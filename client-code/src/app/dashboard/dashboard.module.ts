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
import {DragDropModule} from '@angular/cdk/drag-drop';

import { DashboardComponent } from './dashboard/dashboard.component';
import { EpisodeVisComponent } from './episode-vis/episode-vis.component';

import { SharedModule } from '@app/shared/shared.module';
import { MapModule } from '@app/dashboard/map/map.module';
import { TimelineModule } from './timeline/timeline.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule.forRoot(),
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatSidenavModule,
    MatSliderModule,
    MatToolbarModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MapModule,
    DragDropModule,
    TimelineModule
  ],
  declarations: [
    DashboardComponent,
    EpisodeVisComponent,
  ],
  exports: [DashboardComponent]
})
export class DashboardModule {}
