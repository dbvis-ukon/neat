import { Component, OnInit, Input } from '@angular/core';
import { Episode } from '../episode';
import { Utterance } from '../utterance';
import { EpisodeRepositoryService } from '../episode-repository.service';
import { Observable } from 'rxjs';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';


@Component({
  selector: 'dbvis-episode-app',
  templateUrl: './episode-app.component.html',
  styleUrls: ['./episode-app.component.less']
})
export class EpisodeAppComponent implements OnInit {

  allEpisodes: Array<Observable<Episode>> = [];

  newEpisode: Observable<Episode>;

  newUtterance: Observable<Utterance>;

  allEpisodeClasses = [{
    class: '1',
    utterances: [],
    episodes: []
  },
  // ...
  ];

  constructor(private episodeRepositoryService: EpisodeRepositoryService) { }

  ngOnInit() {
    this.newUtterance = this.episodeRepositoryService.subscribeUtterance();
    this.newEpisode = this.episodeRepositoryService.subscribeEpisode();

    this.allEpisodes = this.episodeRepositoryService.subscribeAllEpisodes();
  }

  drop(event: CdkDragDrop<Episode[]>) {
    console.log("move");
    moveItemInArray(this.allEpisodes, event.previousIndex, event.currentIndex);
}


}
