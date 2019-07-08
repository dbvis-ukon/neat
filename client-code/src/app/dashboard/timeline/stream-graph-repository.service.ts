import { Injectable } from '@angular/core';
import { StreamGraphItem } from './stream-graph-item';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class StreamGraphRepositoryService {

  constructor(private http: HttpClient) { }

  getData(url: string): Observable<StreamGraphItem[]> {
    return this.http.get<StreamGraphItem[]>(url)
    .pipe(
      tap(data => {
        // get Date Obj from str
        data.forEach(item => item.timestamp = new Date(item.timestamp));
      })
    );
  }

  /**
   * Returns all keys that are available in the data.
   */
  getAllKeys(data: StreamGraphItem[]): string[] {
    const uniqEs6 = (arrArg) => {
      return arrArg.filter((elem, pos, arr) => {
        return arr.indexOf(elem) === pos;
      });
    };

    return uniqEs6(data.flatMap(item => item.data.map(d => d.name)));
  }
}
