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

@NgModule({
  entryComponents: [
    UserOptionsDialogComponent
  ],
  declarations: [
    UserOptionsDialogComponent,
    UserOptionsComponent,
    HeaderComponent,
    ResizedDirective
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
    ResizedDirective
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
