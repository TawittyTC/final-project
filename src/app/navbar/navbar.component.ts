import { Component,OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

// Import the AuthService type from the SDK
import { AuthService } from '../_service/auth.service';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit{
  isLoggedIn: boolean = false; // ประกาศตัวแปร isLoggedIn
  isAdmin: boolean = false; 
  constructor(private authService: AuthService) {}
  ngOnInit() {
    this.isLoggedIn = this.authService.isLoggedIn; // ตรวจสอบสถานะการล็อกอิน
    this.isAdmin = localStorage.getItem('role') === 'admin';
  }
  logout() {
    this.authService.logout(); // เรียกใช้ฟังก์ชัน logout() ใน AuthService
  }
  reloadPage() {
    // รีโหลดหน้าเว็บ
    window.location.reload(); 
  }
  
}
