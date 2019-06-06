import { Component, OnInit } from '@angular/core';
import { Episode } from './episodes/episode-vis/episode';
import { HttpClient } from '@angular/common/http';
import { TimelineOptions } from './timeline-vis/timeline-options';
import { MapData } from './map-vis/map-data';
import { MatSliderChange } from '@angular/material';

@Component({
  selector: 'dbvis-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit {

  title = 'vast-challenge-gc19';

  episodeData: Episode;

  constructor(private http: HttpClient) {}

  timelineOptions: TimelineOptions = {
    begin: new Date('2020-01-01 00:00:00'),
    end: new Date('2020-03-31 23:59:59')
  };

  mapData: MapData[];

  ngOnInit(): void {
    // this.http.get<Episode>('/assets/episodes.json').subscribe(episodeData => {
    //   console.log('episode data', episodeData);
    //   this.episodeData = episodeData;
    // });
  }

  /**
   * on every slider change this function is triggered
   * @param change the change event
   */
  sliderChanged(change: MatSliderChange) {
    this.mapData = this.generateRandomMapData(change.value);
  }

  private generateRandomMapData(n): MapData[] {
    const arr: MapData[] = [];

    for (let i = 0; i < n; i++) {
      arr.push({
        x: Math.random(),
        y: Math.random(),
        r: Math.random()
      });
    }

    return arr;
  }
}

