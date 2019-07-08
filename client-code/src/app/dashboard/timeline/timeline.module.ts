import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StreamgraphTooltipComponent } from './streamgraph-tooltip/streamgraph-tooltip.component';
import { TimelineVisComponent } from './timeline-vis/timeline-vis.component';
import { SharedModule } from '@app/shared/shared.module';

@NgModule({
  entryComponents: [
    StreamgraphTooltipComponent
  ],
  declarations: [
    TimelineVisComponent,
    StreamgraphTooltipComponent
  ],
  imports: [
    CommonModule,
    SharedModule.forRoot()
  ],
  exports: [
    TimelineVisComponent
  ]
})
export class TimelineModule { }
