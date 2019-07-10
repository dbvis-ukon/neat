import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StreamgraphTooltipComponent } from './streamgraph-tooltip/streamgraph-tooltip.component';
import { TimelineVisComponent } from './timeline-vis/timeline-vis.component';
import { SharedModule } from '@app/shared/shared.module';
import { FilterDialogComponent } from './filter-dialog/filter-dialog.component';
import {
  MatButtonModule,
  MatDialogModule,
  MatListModule,
  MatCheckboxModule,
  MatFormFieldModule, MatInputModule
} from '@angular/material';
import { FormsModule } from '@angular/forms';
import {TimelineAnnotationModalComponent} from '@app/dashboard/timeline/timeline-annotation-modal/timeline-annotation-modal.component';

@NgModule({
  entryComponents: [
    StreamgraphTooltipComponent,
    FilterDialogComponent,
    TimelineAnnotationModalComponent
  ],
  declarations: [
    TimelineVisComponent,
    StreamgraphTooltipComponent,
    FilterDialogComponent,
    TimelineAnnotationModalComponent
  ],
  imports: [
    CommonModule,
    SharedModule.forRoot(),
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatListModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule
  ],
  exports: [
    TimelineVisComponent,
    FilterDialogComponent
  ]
})
export class TimelineModule { }
