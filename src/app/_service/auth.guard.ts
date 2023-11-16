import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | UrlTree | Observable<boolean | UrlTree> {
    const requiredRoles = next.data['roles'] as Array<string>; // Get the required roles from route data

    if (!requiredRoles || requiredRoles.length === 0) {
      // If no roles are specified, allow access
      return true;
    }

    const userRole = localStorage.getItem('role'); // Retrieve the user's role from localStorage

    if (userRole && requiredRoles.includes(userRole)) {
      // If the user has one of the required roles, allow access
      return true;
    } else {
      // If the user doesn't have the required role, redirect to '/login-component'
      return this.router.parseUrl('/login-component');
    }
    
  }
}
