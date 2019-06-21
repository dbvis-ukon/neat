import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EchoTestComponent } from './echo-test/echo-test.component';
import { DashboardComponent } from './dashboard/dashboard/dashboard.component';
import { HomeComponent } from './home/home.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { AuthGuard } from '@app/core';
import { DemoVisComponent } from './shared/demo-vis/demo-vis.component';

const routes: Routes = [
  {
    path: '',
    component: WelcomeComponent
  },
  {
    canActivate: [AuthGuard],
    path: 'groups',
    component: HomeComponent
  },
  {
    canActivate: [AuthGuard],
    path: 'dashboard/:id',
    component: DashboardComponent
  },
  {
    path: 'echotest',
    component: EchoTestComponent
  },
  {
    path: 'demovis',
    component: DemoVisComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
