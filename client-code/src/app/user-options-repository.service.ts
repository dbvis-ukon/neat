import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { UserOptions } from '../../../shared/user-options';
import { isNullOrUndefined } from 'util';
import * as uuid from 'uuid/v4';
import { SessionStorageService } from 'angular-web-storage';

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

  constructor(private sessionStorage: SessionStorageService) {
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
    console.log('new user', options);

    this.sessionStorage.set(UserOptionsRepositoryService.SESSION_STORAGE_KEY, JSON.stringify(options));

    this.userOptionsSubject.next(Object.assign(this.getOptions(), options));
  }
}
