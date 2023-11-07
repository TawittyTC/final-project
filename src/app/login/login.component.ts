import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../service/auth.service';
import { User } from '../service/user';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  user: User = new User(); // ใช้ User ในการรับข้อมูล

  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  login() {
    this.authService.signIn(this.user) // ส่ง User แทนค่าแยก
      .subscribe(
        (res: any) => {
          if (res.token) {
            // บันทึก JWT ใน localStorage หลังจากล็อกอินสำเร็จ
            localStorage.setItem('access_token', res.token);
            // นำทางไปยังหน้าที่คุณต้องการหลังจากล็อกอินสำเร็จ
            this.router.navigate(['/device-component']); // แก้ไขเส้นทางตามต้องการ

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
    this.authService.logout(); // เรียกใช้ฟังก์ชัน logout() ใน AuthService
  }
  reloadPage() {
    // รีโหลดหน้าเว็บ
    location.reload();
  }
}
