import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Mc1Item } from '@shared';
import { HttpClient } from '@angular/common/http';
import { filter, flatMap, toArray, map, tap, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class Mc1DataRepositoryService {

  constructor(private http: HttpClient) {}

  public getMc1Data(): Observable<Mc1Item[]> {
    return this.http.get<Mc1Item[]>('/assets/mc1-reports-data.json')
      .pipe(
        flatMap(item => item), // map from array to single items
        map(item => { // do all the parsing stuff
          item.time = new Date('' + item.time);
          return item;
        }),
        // take(10), // only use the first 10 items
        // tap(val => console.log(`AFTER MAP: ${val.time}`)),
        toArray() // make an array again
      );
  }

  public getBrushFilteredMc1Data(brush: [Date, Date]): Observable<Mc1Item[]> {
    return this.getMc1Data()
      .pipe(
        flatMap(item => item),
        filter(d => d.time.getTime() >= brush[0].getTime() && d.time.getTime() <= brush[1].getTime()),
        toArray()
      );
  }
}
