import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserOptionsDialogComponent } from './user-options-dialog/user-options-dialog.component';
import { HeaderComponent } from './header/header.component';
import { UserOptionsComponent } from './user-options/user-options.component';
import { AppRoutingModule } from '@app/app-routing.module';
import {
  MatIconModule,
  MatToolbarModule,
  MatButtonModule,
  MatInputModule,
  MatDialogModule,
  MatTooltipModule
} from '@angular/material';
import { FormsModule } from '@angular/forms';
import { ColorPickerModule } from 'ngx-color-picker';
import { ResizedDirective } from './resized.directive';
import { ExampleTooltipComponent } from './example-tooltip/example-tooltip.component';
import { DemoVisComponent } from './demo-vis/demo-vis.component';
import { TimelineAnnotationModalComponent } from './timeline-annotation-modal/timeline-annotation-modal.component';

@NgModule({
  entryComponents: [
    UserOptionsDialogComponent,
    ExampleTooltipComponent,
    TimelineAnnotationModalComponent
  ],
  declarations: [
    UserOptionsDialogComponent,
    UserOptionsComponent,
    HeaderComponent,
    ResizedDirective,
    ExampleTooltipComponent,
    DemoVisComponent,
    TimelineAnnotationModalComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    AppRoutingModule,
    MatIconModule,
    MatToolbarModule,
    MatButtonModule,
    MatInputModule,
    ColorPickerModule,
    MatDialogModule,
    MatTooltipModule
  ],
  exports: [
    UserOptionsDialogComponent,
    UserOptionsComponent,
    HeaderComponent,
    ResizedDirective,
    ExampleTooltipComponent,
    DemoVisComponent
  ]
})
export class SharedModule {
  static forRoot(): ModuleWithProviders<SharedModule> {
    return {
      ngModule: SharedModule,
      providers: []
    };
  }
}
