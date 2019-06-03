import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Group } from '@shared';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GroupRepositoryService {

  constructor(private http: HttpClient) { }

  public list(): Observable<Group[]> {
    return this.http.get<Group[]>(environment.apiUrl + '/group');
  }

  public get(id: string): Observable<Group> {
    console.log('get group by id ' + id);
    return this.http.get<Group>(environment.apiUrl + '/group/' + id);
  }

  public create(name: string): Observable<Group> {
    if (!name || name.length < 2) {
      throw new Error('Insert a valid name');
    }
    return this.http.post<Group>(environment.apiUrl + '/group', {name});
  }
}
