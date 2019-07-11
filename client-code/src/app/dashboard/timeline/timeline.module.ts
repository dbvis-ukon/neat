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

@NgModule({
  entryComponents: [
    StreamgraphTooltipComponent,
    FilterDialogComponent,
  ],
  declarations: [
    TimelineVisComponent,
    StreamgraphTooltipComponent,
    FilterDialogComponent,
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
