import { Component, OnInit } from '@angular/core';
import { Episode } from './episode-vis/episode';

@Component({
  selector: 'dbvis-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit {

  title = 'vast-challenge-gc19';

  episodeData: Episode = {
    episode: 'test',
    bla: 'test'
  } as Episode;

  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }
}
