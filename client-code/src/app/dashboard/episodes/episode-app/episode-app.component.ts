import { Component, OnInit, Input } from '@angular/core';
import { Episode } from '../episode';
import { Utterance } from '../utterance';
import { EpisodeRepositoryService } from '../episode-repository.service';
import { Observable } from 'rxjs';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import {Timelinedata} from '@app/dashboard/episodes/timelinedata';
import {TimelineDataService} from '@app/dashboard/episodes/timeline-data.service';
import {EpisodeCategory} from "@app/dashboard/episodes/EpisodeCategory";


@Component({
  selector: 'dbvis-episode-app',
  templateUrl: './episode-app.component.html',
  styleUrls: ['./episode-app.component.less']
})
export class EpisodeAppComponent implements OnInit {

  allEpisodes: EpisodeCategory[];

  timelineData: Observable<Timelinedata[]>;

  constructor(private episodeRepositoryService: EpisodeRepositoryService,
              private timelineDataService: TimelineDataService) { }

  ngOnInit() {
    this.episodeRepositoryService.subscribeAllEpisodes()
      .subscribe(all => {
        this.allEpisodes = all;
        console.log(this.allEpisodes);
      });

    this.timelineData = this.timelineDataService.subscribeOverallTimelineData();
  }

  drop(event: CdkDragDrop<Episode[]>) {
    console.log('move');
    // moveItemInArray(this.allEpisodes, event.previousIndex, event.currentIndex);
}


}
