import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EpisodeAppComponent } from './episode-app/episode-app.component';

const routes: Routes = [
  {
    path: 'episode',
    component: EpisodeAppComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
