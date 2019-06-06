import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Group, GroupSettings } from '@shared';
import { Observable, Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { RxStompService } from '@stomp/ng2-stompjs';
import { map } from 'rxjs/operators';
import { Message } from '@stomp/stompjs';

@Injectable({
  providedIn: 'root'
})
export class GroupRepositoryService {

  private subscription: Subscription;

  constructor(private http: HttpClient, private rxStompService: RxStompService) { }

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

  public listenForUpdates(groupId: string): Observable<GroupSettings> {
    const d = this.rxStompService.watch('/group/' + groupId)
      .pipe(
        map((message: Message) => JSON.parse(message.body) as GroupSettings)
      );

    this.subscription = d.subscribe();

    return d;
  }

  public stopListenForUpdates(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
