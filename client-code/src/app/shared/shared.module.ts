import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserOptionsDialogComponent } from './user-options-dialog/user-options-dialog.component';
import { HeaderComponent } from './header/header.component';
import { UserOptionsComponent } from './user-options/user-options.component';
import { AppRoutingModule } from '@app/app-routing.module';
import { MatIconModule, MatToolbarModule, MatButtonModule, MatInputModule, MatDialogModule } from '@angular/material';
import { FormsModule } from '@angular/forms';
import { ColorPickerModule } from 'ngx-color-picker';
import { ResizedDirective } from './resized.directive';
import { ExampleTooltipComponent } from './example-tooltip/example-tooltip.component';
import { DemoVisComponent } from './demo-vis/demo-vis.component';

@NgModule({
  entryComponents: [
    UserOptionsDialogComponent,
    ExampleTooltipComponent
  ],
  declarations: [
    UserOptionsDialogComponent,
    UserOptionsComponent,
    HeaderComponent,
    ResizedDirective,
    ExampleTooltipComponent,
    DemoVisComponent
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
    MatDialogModule
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
