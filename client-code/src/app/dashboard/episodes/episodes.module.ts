import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EpisodeAppComponent } from './episode-app/episode-app.component';
import { EpisodeVisComponent } from './episode-vis/episode-vis.component';
import { EpisodeTooltipComponent } from './episode-tooltip/episode-tooltip.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import {
  MatButtonModule,
  MatIconModule
} from '@angular/material';
import {EpisodeTimelineComponent} from './episode-timeline/episode-timeline.component';
import {EpisodeTimelineTooltipComponent} from '@app/dashboard/episodes/episode-timeline-tooltip/episode-timeline-tooltip.component';

@NgModule({
  entryComponents: [
    EpisodeTooltipComponent,
    EpisodeTimelineTooltipComponent
  ],
  declarations: [EpisodeVisComponent, EpisodeAppComponent, EpisodeTooltipComponent,
    EpisodeTimelineComponent, EpisodeTimelineTooltipComponent],
  imports: [
    CommonModule,
    DragDropModule,
    MatButtonModule,
    MatIconModule
  ],
  exports: [
    EpisodeAppComponent,
    EpisodeVisComponent
  ]
})
export class EpisodesModule { }
