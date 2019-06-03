import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AngularResizedEventModule } from 'angular-resize-event';
import {
  MatSliderModule,
  MatButtonModule,
  MatInputModule,
  MatListModule,
  MatToolbarModule,
  MatCardModule,
  MatIconModule,
  MatDialogModule
} from '@angular/material';
import { HttpClientModule } from '@angular/common/http';
import { ColorPickerModule } from 'ngx-color-picker';
import { AngularWebStorageModule } from 'angular-web-storage';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EpisodeVisComponent } from './episode-vis/episode-vis.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TimelineVisComponent } from './timeline-vis/timeline-vis.component';
import { MapVisComponent } from './map-vis/map-vis.component';
import { InjectableRxStompConfig, RxStompService, rxStompServiceFactory } from '@stomp/ng2-stompjs';
import { myRxStompConfig } from './stomp.config';
import { EchoTestComponent } from './echo-test/echo-test.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HomeComponent } from './home/home.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserOptionsComponent } from './user-options/user-options.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { HeaderComponent } from './header/header.component';
import { UserOptionsDialogComponent } from './user-options-dialog/user-options-dialog.component';

@NgModule({
  entryComponents: [
    UserOptionsDialogComponent
  ],
  declarations: [
    AppComponent,
    EpisodeVisComponent,
    TimelineVisComponent,
    MapVisComponent,
    EchoTestComponent,
    DashboardComponent,
    HomeComponent,
    UserOptionsComponent,
    WelcomeComponent,
    HeaderComponent,
    UserOptionsDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    AngularResizedEventModule,
    MatSliderModule,
    MatButtonModule,
    MatInputModule,
    MatListModule,
    MatToolbarModule,
    MatCardModule,
    MatIconModule,
    MatDialogModule,
    ColorPickerModule,
    AngularWebStorageModule
  ],
  providers: [
    {
      provide: InjectableRxStompConfig,
      useValue: myRxStompConfig
    },
    {
      provide: RxStompService,
      useFactory: rxStompServiceFactory,
      deps: [InjectableRxStompConfig]
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
