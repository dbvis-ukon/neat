import { Component, OnInit } from '@angular/core';
import { Episode } from './episode-vis/episode';
import { TimelineOptions } from './timeline-vis/timeline-options';
import { MapData } from './map-vis/map-data';
import { MatSliderChange } from '@angular/material';

@Component({
  selector: 'dbvis-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {

  title = 'vast-challenge-gc19';
}
