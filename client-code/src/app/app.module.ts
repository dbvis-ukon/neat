import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AngularResizedEventModule } from 'angular-resize-event';
import { MatSliderModule, MatButtonModule } from '@angular/material';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TimelineVisComponent } from './timeline-vis/timeline-vis.component';
import { MapVisComponent } from './map-vis/map-vis.component';
import { EpisodesModule } from './episodes/episodes.module';

@NgModule({
  declarations: [
    AppComponent,
    TimelineVisComponent,
    MapVisComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    AngularResizedEventModule,
    MatSliderModule,
    MatButtonModule,
    EpisodesModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
