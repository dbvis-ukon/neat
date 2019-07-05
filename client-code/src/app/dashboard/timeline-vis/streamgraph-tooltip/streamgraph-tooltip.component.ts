import { Component, OnInit, Input } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'dbvis-streamgraph-tooltip',
  templateUrl: './streamgraph-tooltip.component.html',
  styleUrls: ['./streamgraph-tooltip.component.less'],
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
export class StreamgraphTooltipComponent implements OnInit {
  @Input()
  text: string;

  constructor() { }

  ngOnInit() {
  }
}
