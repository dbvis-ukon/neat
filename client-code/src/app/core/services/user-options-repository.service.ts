import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { UserOptions } from '@shared';
import { isNullOrUndefined } from 'util';
import * as uuid from 'uuid/v4';
import { SessionStorageService } from 'angular-web-storage';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import {debounceTime} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserOptionsRepositoryService {

  private static readonly SESSION_STORAGE_KEY = 'vc-gc-19-userOptions';

  public redirectUrl: string;

  private userOptionsSubject: BehaviorSubject<UserOptions> = new BehaviorSubject({
    id: null,
    name: '',
    color: ''
  });
  public userOptions$: Observable<UserOptions> = this.userOptionsSubject.asObservable();

  private oldStr: string;

  constructor(private sessionStorage: SessionStorageService, private http: HttpClient) {
    if (this.sessionStorage.get(UserOptionsRepositoryService.SESSION_STORAGE_KEY)) {
      this.setOptions(JSON.parse(this.sessionStorage.get(UserOptionsRepositoryService.SESSION_STORAGE_KEY)));
    }
  }

  public getOptions(): UserOptions {
    return this.userOptionsSubject.value;
  }

  public setOptions(options: UserOptions) {
    if (isNullOrUndefined(options.id)) {
      options.id = uuid();
    }
    const newStr = JSON.stringify(options);

    if (this.oldStr !== newStr) {
      this.sessionStorage.set(UserOptionsRepositoryService.SESSION_STORAGE_KEY, JSON.stringify(options));

      if (options.groupId) {
        this.http.post<void>(environment.apiUrl + '/user', options, {headers: new HttpHeaders({
          'group-id':  options.groupId,
          'user-id': options.id
        })}).subscribe();
      }

      this.userOptionsSubject.next(Object.assign(this.getOptions(), options));
    }

    this.oldStr = newStr;
  }

  public leaveGroup() {
    const oldOpts = this.getOptions();
    const opts = {
      id: oldOpts.id,
      name: oldOpts.name,
      color: oldOpts.color
    } as UserOptions;
    this.userOptionsSubject.next(opts);
    this.sessionStorage.set(UserOptionsRepositoryService.SESSION_STORAGE_KEY, JSON.stringify(opts));
  }

  public deleteUser(userId: string) {
    return this.http.delete<void>(environment.apiUrl + '/user/' + userId).subscribe();
  }

  public sayHello(userId: string, groupId: string) {
    this.http.get<void>(environment.apiUrl + '/user/hello/' + userId, {headers: new HttpHeaders({
      'group-id':  groupId,
      'user-id': userId
    })}).subscribe();
  }
}
