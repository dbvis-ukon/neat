import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EchoTestComponent } from './echo-test/echo-test.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'dashboard/:id',
    component: DashboardComponent
  },
  {
  path: 'echotest',
  component: EchoTestComponent
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
