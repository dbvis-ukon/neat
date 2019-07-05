import { Component, OnInit, Input } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'dbvis-episode-timeline-tooltip',
  templateUrl: './episode-timeline-tooltip.component.html',
  styleUrls: ['./episode-timeline-tooltip.component.less'],
  animations: [
    trigger('tooltip', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate(300, style({ opacity: 1 })),
      ]),
      transition(':leave', [
        animate(300, style({ opacity: 0 })),
      ]),
    ]),
  ],
})
export class EpisodeTimelineTooltipComponent implements OnInit {

  @Input()
  date: Date;

  @Input()
  count: number;

  constructor() { }

  ngOnInit() {
  }

}
