import { Component, OnInit } from '@angular/core';
import { Episode } from './episode-vis/episode';
import { TimelineOptions } from './timeline-vis/timeline-options';

@Component({
  selector: 'dbvis-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit {

  title = 'vast-challenge-gc19';

  episodeData: Episode;

  timelineOptions: TimelineOptions = {
    begin: new Date('2020-01-01 00:00:00'),
    end: new Date('2020-03-31 23:59:59')
  };

  ngOnInit(): void {
    // throw new Error('Method not implemented.');
  }
}
