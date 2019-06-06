import { Component, OnInit } from '@angular/core';
import { Episode } from '../episodes/episode-vis/episode';
import { Utterance } from '../episodes/episode-vis/utterance';
import { EpisodeRepositoryService } from '../episodes/episode-repository.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'dbvis-episode-app',
  templateUrl: './episode-app.component.html',
  styleUrls: ['./episode-app.component.less']
})
export class EpisodeAppComponent implements OnInit {

  newEpisode: Observable<Episode>;

  newUtterance: Utterance;

  allEpisodeClasses = [{
    class: '1',
    utterances: [],
    episodes: []
  },
  // ...
  ];

  constructor(private episodeRepositoryService: EpisodeRepositoryService) { }

  ngOnInit() {
    this.episodeRepositoryService.subscribeUtterance().subscribe(utterance => this.newUtterance = utterance);

    this.newEpisode = this.episodeRepositoryService.subscribeEpisode();
  }

}
