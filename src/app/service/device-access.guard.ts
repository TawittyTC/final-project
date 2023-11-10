import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { ApiService } from '../api.service';

@Injectable({
  providedIn: 'root',
})
export class DeviceAccessGuard implements CanActivate {
  constructor(private apiService: ApiService, private router: Router) {}

  canActivate(): boolean {
    // ดึงข้อมูลอุปกรณ์จาก API
    this.apiService.getAllData().subscribe((devices) => {
      // ตรวจสอบว่าผู้ใช้มีสิทธิ์ในการเข้าถึงหน้า DeviceComponent หรือไม่
      const hasAccessLevel1 = devices.some((device) => device.level === 1); // ตรวจสอบว่ามีอุปกรณ์ที่ level 1 หรือไม่
      const isAuthenticated = this.isAuthenticated(); // ตรวจสอบว่าผู้ใช้เข้าสู่ระบบแล้วหรือยัง

      if (!hasAccessLevel1 && !isAuthenticated) {
        // ถ้าไม่มีสิทธิ์ในการเข้าถึงและไม่ได้เข้าสู่ระบบ ให้นำทางไปยังหน้าอื่น (เช่นหน้า login)
        this.router.navigate(['/login']); // เปลี่ยน '/login' เป็นเส้นทางที่คุณต้องการ
        return false;
      }

      return true; // ผู้ใช้มีสิทธิ์เข้าถึงหน้า DeviceComponent
    });

    return true; // สำหรับกรณีอื่น ๆ ที่ไม่เกี่ยวข้อง
  }

  isAuthenticated(): boolean {
    // ตรวจสอบว่าผู้ใช้เข้าสู่ระบบแล้วหรือยัง ในตัวอย่างนี้คุณอาจใช้ AuthService หรือเงื่อนไขอื่น ๆ เพื่อตรวจสอบสถานะการเข้าสู่ระบบ
    // คืนค่า true ถ้าผู้ใช้เข้าสู่ระบบ และคืนค่า false ถ้ายังไม่เข้าสู่ระบบ
    return true; // เปลี่ยนตามสถานะการเข้าสู่ระบบของคุณ
  }
}
