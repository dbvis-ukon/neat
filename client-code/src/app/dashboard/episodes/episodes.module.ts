import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EpisodeAppComponent } from './episode-app/episode-app.component';
import { EpisodeVisComponent } from './episode-vis/episode-vis.component';
import { EpisodeTooltipComponent } from './episode-tooltip/episode-tooltip.component';

@NgModule({
  entryComponents: [
    EpisodeTooltipComponent
  ],
  declarations: [EpisodeVisComponent, EpisodeAppComponent, EpisodeTooltipComponent],
  imports: [
    CommonModule
  ],
  exports: [
    EpisodeAppComponent
  ]
})
export class EpisodesModule { }
