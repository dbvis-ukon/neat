import { Component, OnInit, Input } from '@angular/core';
import { Episode } from '../episode';
import { Utterance } from '../utterance';
import { EpisodeRepositoryService } from '../episode-repository.service';
import { Observable } from 'rxjs';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';


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
    console.log(event.previousIndex);
    console.log(event.currentIndex);
    //moveItemInArray(this.allEpisodes, event.previousIndex, event.currentIndex);
    if (event.previousContainer === event.container) { moveItemInArray(this.allEpisodes, event.previousIndex, event.currentIndex); } 
    //if (event.previousContainer === event.container) { moveItemInArray(event.container.data, event.previousIndex, event.currentIndex); } else { transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex); }
  }

  hide(event) {
    const pEle = event.currentTarget.parentElement;
    // tslint:disable-next-line: radix
    if (!isNaN(pEle.style.width) || parseInt(pEle.style.width) === 450) {
      pEle.style.width = '100px';
      pEle.style.height = '90px';
    } else {
      pEle.style.width = '450px';
      pEle.style.height = 'auto';
    }
  }
}
