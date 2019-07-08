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

import { SharedModule } from '@app/shared/shared.module';
import { EpisodesModule } from './episodes/episodes.module';
import { MapModule } from '@app/dashboard/map/map.module';
import { TimelineModule } from './timeline/timeline.module';

@NgModule({
  declarations: [
    DashboardComponent,
  ],
  imports: [
    CommonModule,
    SharedModule.forRoot(),
    MatSidenavModule,
    MatButtonModule,
    EpisodesModule,
    MapModule,
    DragDropModule,
    TimelineModule,
    MatIconModule,
    MatListModule,
    MatSliderModule,
    MatToolbarModule
  ],
  exports: [
    DashboardComponent
  ]
})
export class DashboardModule {}
