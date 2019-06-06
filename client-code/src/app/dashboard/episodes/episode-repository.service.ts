import { Injectable } from '@angular/core';
import { Observable, from, of } from 'rxjs';
import { Episode } from './episode';
import { Utterance } from './utterance';
import { delay, filter } from 'rxjs/internal/operators';
import { concatMap } from 'rxjs/internal/operators';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EpisodeRepositoryService {

  constructor(private http: HttpClient) { }

  public subscribeEpisode(): Observable<Episode> {
    return this.http.get<Episode[]>('/assets/episodes_roads.json')
    .pipe(
      concatMap(episode => episode)
    );
  }

  public subscribeUtterance(): Observable<Utterance> {
    const fakeUtterances: Utterance[] = [];

    return from(fakeUtterances).pipe(
      concatMap(utterance => of(utterance).pipe(delay(500)))
    );
  }
}
