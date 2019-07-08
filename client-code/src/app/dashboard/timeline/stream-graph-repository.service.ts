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
    return this.uniqEs6(data.flatMap(item => item.data.map(d => d.name)));
  }

  filter(data: StreamGraphItem[], filterNames: string[]) {
    // const dataCopy: StreamGraphItem[] = JSON.parse(JSON.stringify(data));
    return data
    .map(d => {
      const newData = d.data.filter(d1 => filterNames.includes(d1.name));
      return {
        timestamp: d.timestamp,
        data: newData
      } as StreamGraphItem;
    })
    .filter(d => d.data.length > 0);
  }

  private uniqEs6<T>(arrArg: Array<T>): Array<T> {
    return arrArg.filter((elem, pos, arr) => arr.indexOf(elem) === pos);
  }
}
