import { Injectable } from '@angular/core';
import { Subject, Observable, BehaviorSubject } from 'rxjs';
import { UserOptions } from '../../../shared/user-options';

@Injectable({
  providedIn: 'root'
})
export class UserOptionsRepositoryService {

  private userOptionsSubject: BehaviorSubject<UserOptions> = new BehaviorSubject({
    id: 'new',
    name: '?',
    color: 'red'
  });
  public userOptions$: Observable<UserOptions> = this.userOptionsSubject.asObservable();

  constructor() {}

  public getOptions(): UserOptions {
    return this.userOptionsSubject.value;
  }

  public setOptions(options: UserOptions) {
    this.userOptionsSubject.next(options);
  }
}
