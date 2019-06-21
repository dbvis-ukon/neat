import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {
  MatButtonModule,
  MatInputModule,
  MatListModule,
  MatCardModule,
} from '@angular/material';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { InjectableRxStompConfig, RxStompService, rxStompServiceFactory } from '@stomp/ng2-stompjs';
import { myRxStompConfig } from './stomp.config';
import { EchoTestComponent } from './echo-test/echo-test.component';
import { HomeComponent } from './home/home.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { WelcomeComponent } from './welcome/welcome.component';
import { DashboardModule } from './dashboard/dashboard.module';
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';
import { OverlayModule } from '@angular/cdk/overlay';

@NgModule({
  entryComponents: [
  ],
  declarations: [
    AppComponent,
    EchoTestComponent,
    HomeComponent,
    WelcomeComponent,
  ],
  imports: [
    BrowserModule,
    OverlayModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    CoreModule,
    SharedModule.forRoot(),
    MatButtonModule,
    MatInputModule,
    MatListModule,
    MatCardModule,
    DashboardModule,
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
