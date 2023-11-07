import { Component, OnInit } from '@angular/core';
import { AuthService } from '../service/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  user: any; // ใช้รับข้อมูลผู้ใช้

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authService.getUserProfile().subscribe((data: any) => {
      this.user = data;
    });
  }
}
