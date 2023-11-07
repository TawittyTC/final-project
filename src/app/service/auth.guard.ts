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
    if (this.authService.isLoggedIn) {
      // ถ้าผู้ใช้ล็อกอินอยู่ให้อนุญาตให้เข้าถึงเส้นทาง
      return true;
    } else {
      // ถ้าผู้ใช้ไม่ได้ล็อกอินให้นำทางไปยังหน้าล็อกอิน
      return this.router.parseUrl('/login-component'); // แก้ไข URL ตามต้องการ
    }
  }
}
