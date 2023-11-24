import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_service/auth.service';
import { ApiService } from '../_service/api.service';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  name: string = '';
  lname: string = '';
  email: string = '';
  role: string = '';
  level: string = '';
  group: string = '';
  constructor(private apiService: ApiService) {}
  ngOnInit() {

  const userEmail = localStorage.getItem('email') || '';

  // เรียกใช้งาน ApiService เพื่อดึงข้อมูลผู้ใช้โดยใช้อีเมลจาก local storage
  this.apiService.getUserByEmail(userEmail).subscribe(
    (userData) => {
      // กำหนดค่าที่ได้จาก API ลงใน properties ของ component
      this.name = userData.name || '';
      this.lname = userData.lname || '';
      this.email = userData.email || '';
      this.role = userData.role || '';
      this.level = userData.level || '';
      this.group = userData.group || '';
    },
    (error) => {
      console.error('Error fetching user data:', error);
    }
  );
  }
}
