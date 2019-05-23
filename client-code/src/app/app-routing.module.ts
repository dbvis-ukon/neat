import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EchoTestComponent } from './echo-test/echo-test.component';

const routes: Routes = [{
  path: 'echotest',
  component: EchoTestComponent
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
