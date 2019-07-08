import { Injectable } from '@angular/core';
import {Observable, from, of, range, merge} from 'rxjs';
import { Episode } from './episode';
import { Utterance } from './utterance';
import { HttpClient } from '@angular/common/http';
import {EpisodeCategory} from "@app/dashboard/episodes/EpisodeCategory";
import {CrisisLexCategory} from "@app/dashboard/episodes/CrisisLexCategory";
import {CrisislexCategoriesService} from "@app/dashboard/episodes/CrisislexCategoryService";
import {concatMap, map, toArray} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class EpisodeRepositoryService {

  constructor(private http: HttpClient,
              private crisislexCategoriesService: CrisislexCategoriesService) { }

  public subscribeAllEpisodes(): Observable<EpisodeCategory[]> {
    return this.crisislexCategoriesService.categories
      .pipe(
        map(cat => {
          const episodes: Observable<Episode[]> = this.subscribeEpisodeByFile('episodes_' + cat.code + '.json');
          return new EpisodeCategory(episodes, cat);
        }),
        toArray()
      );
  }

  public subscribeEpisodeByFile(filename: string): Observable<Episode[]> {
    return this.http.get<Episode[]>('/assets/' + filename);
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
