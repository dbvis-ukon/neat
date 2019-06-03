import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AngularResizedEventModule } from 'angular-resize-event';
import { MatSliderModule, MatButtonModule, MatInputModule, MatListModule, MatToolbarModule } from '@angular/material';
import { HttpClientModule } from '@angular/common/http';

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
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    EpisodeVisComponent,
    TimelineVisComponent,
    MapVisComponent,
    EchoTestComponent,
    DashboardComponent,
    HomeComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    AngularResizedEventModule,
    MatSliderModule,
    MatButtonModule,
    MatInputModule,
    MatListModule,
    MatToolbarModule
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
