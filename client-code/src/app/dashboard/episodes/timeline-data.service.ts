import { Injectable } from '@angular/core';
import { Observable, from, of, range } from 'rxjs';
import { Episode } from './episode';
import { Utterance } from './utterance';
import {delay, filter, map, tap} from 'rxjs/internal/operators';
import { concatMap } from 'rxjs/internal/operators';
import { HttpClient } from '@angular/common/http';
import {Timelinedata} from '@app/dashboard/episodes/timelinedata';
import {RawTimelineData} from '@app/dashboard/episodes/RawTimelineData';

@Injectable({
  providedIn: 'root'
})
export class TimelineDataService {

  constructor(private http: HttpClient) { }

  public subscribeOverallTimelineData(): Observable<Timelinedata[]> {
    const filename = 'tweets_by_timestamp_count.json';
    return this.http.get<RawTimelineData[]>('/assets/' + filename).pipe(map(
      rawData => {
        const t = [];
        for (const data of rawData) {
          t.push(new Timelinedata(data.datetime, data.count));
        }

        const last: Timelinedata = t[t.length - 1];
        return t;
      }
    ));
  }

  // public subscribeIndividualTimelineData(): Array<Observable<Timelinedata[]>> {
  //   const filename = 'tweets_by_timestamp_count.json';
  //   return this.http.get<RawTimelineData[]>('/assets/' + filename).pipe(map(
  //     rawData => {
  //       const t = [];
  //       for (const data of rawData) {
  //         t.push(new Timelinedata(data.datetime, data.count));
  //       }
  //       return t;
  //     }
  //   ));
  // }
}
