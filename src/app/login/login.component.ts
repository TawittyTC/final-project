import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../service/auth.service';
import { User } from '../service/user';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  user: User = new User();
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    // ตรวจสอบว่ามี Token ใน localStorage หรือไม่
    const token = localStorage.getItem('access_token');
    if (token) {
      // ถ้ามี Token อยู่ ให้ route ไปยังหน้า DeviceComponent
      this.router.navigate(['/device-component']);
    }
  }

  login() {
    this.authService.signIn(this.user)
      .subscribe(
        (res: any) => {
          if (res.token) {
            localStorage.setItem('access_token', res.token);
            this.router.navigate(['/device-component']);
            this.reloadPage();
          } else {
            this.errorMessage = 'อีเมลหรือรหัสผ่านไม่ถูกต้อง';
          }
        },
        error => {
          this.errorMessage = 'เข้าสู่ระบบล้มเหลว';
        }
      );
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']); // หากต้องการกลับไปหน้า login หลังจาก logout
    this.reloadPage();
  }

  reloadPage() {
    location.reload();
  }
}
