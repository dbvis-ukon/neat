import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EpisodeAppComponent } from './episode-app/episode-app.component';
import { EpisodeVisComponent } from './episode-vis/episode-vis.component';

@NgModule({
  declarations: [EpisodeVisComponent, EpisodeAppComponent],
  imports: [
    CommonModule
  ],
  exports: [
    EpisodeAppComponent
  ]
})
export class EpisodesModule { }
