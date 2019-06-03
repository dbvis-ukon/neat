import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UserOptionsRepositoryService } from '../user-options-repository.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private userOptionsRepository: UserOptionsRepositoryService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      const url: string = state.url;
      return this.checkLogin(url);
  }

  checkLogin(url: string): boolean {
    console.log('check login');
    if (this.userOptionsRepository.getOptions().id) { return true; }

    // Store the attempted URL for redirecting
    this.userOptionsRepository.redirectUrl = url;

    // Navigate to the login page with extras
    this.router.navigate(['/']);
    return false;
  }
}
