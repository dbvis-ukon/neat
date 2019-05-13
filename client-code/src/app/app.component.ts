import { Component, OnInit } from '@angular/core';
import { Episode } from './episode-vis/episode';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'dbvis-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit {

  title = 'vast-challenge-gc19';

  episodeData: Episode;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<Episode>('/assets/episodes.json').subscribe(episodeData => {
      console.log('episode data', episodeData);
      this.episodeData = episodeData;
    });
  }
}
