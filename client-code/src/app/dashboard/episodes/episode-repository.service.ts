import { Injectable } from '@angular/core';
import { Observable, from, of, range } from 'rxjs';
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

  public subscribeAllEpisodes(): Array<Observable<Episode>> {
    const episodes: Array<Observable<Episode>> = [];

    range(1, 8).subscribe(curRange => {
      episodes.push(this.subscribeEpisodeByFile('episodes_C0' + curRange + '.json'));
    });

    return episodes;
  }

  public subscribeEpisodeByFile(filename: string): Observable<Episode> {
    return this.http.get<Episode[]>('/assets/' + filename)
    .pipe(
      concatMap(episode => episode)
    );
  }

  public subscribeEpisode(): Observable<Episode> {
    return this.http.get<Episode[]>('/assets/episodes_C01.json')
    .pipe(
      concatMap(episode => episode)
    );
  }

  public subscribeUtterance(): Observable<Utterance> {
    return this.http.get<Utterance[]>('/assets/episodes_road_incl_messages.json')
    .pipe(
      concatMap(utterance => utterance)
    );
    // const fakeUtterances: Utterance[] = [];

    // return from(fakeUtterances).pipe(
    //   concatMap(utterance => of(utterance).pipe(delay(500)))
    // );
  }
}
