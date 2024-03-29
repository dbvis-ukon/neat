import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EpisodeAppComponent } from './episode-app/episode-app.component';
import { EpisodeVisComponent } from './episode-vis/episode-vis.component';
import { EpisodeTooltipComponent } from './episode-tooltip/episode-tooltip.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import {
  MatButtonModule,
  MatIconModule,
  MatListModule
} from '@angular/material';
import {EpisodeTimelineComponent} from './episode-timeline/episode-timeline.component';
import {EpisodeTimelineTooltipComponent} from '@app/dashboard/episodes/episode-timeline-tooltip/episode-timeline-tooltip.component';
import { SharedModule } from '@app/shared/shared.module';

@NgModule({
  entryComponents: [
    EpisodeTooltipComponent,
    EpisodeTimelineTooltipComponent
  ],
  declarations: [
    EpisodeVisComponent,
    EpisodeAppComponent,
    EpisodeTooltipComponent,
    EpisodeTimelineComponent,
    EpisodeTimelineTooltipComponent
  ],
  imports: [
    CommonModule,
    DragDropModule,
    MatButtonModule,
    MatIconModule,
    SharedModule.forRoot(),
    MatListModule
  ],
  exports: [
    EpisodeAppComponent,
    EpisodeVisComponent
  ]
})
export class EpisodesModule { }
