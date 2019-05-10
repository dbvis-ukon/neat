import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AngularResizedEventModule } from 'angular-resize-event';
import { MatSliderModule, MatButtonModule } from '@angular/material';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EpisodeVisComponent } from './episode-vis/episode-vis.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TimelineVisComponent } from './timeline-vis/timeline-vis.component';
import { MapVisComponent } from './map-vis/map-vis.component';

@NgModule({
  declarations: [
    AppComponent,
    EpisodeVisComponent,
    TimelineVisComponent,
    MapVisComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AngularResizedEventModule,
    MatSliderModule,
    MatButtonModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
