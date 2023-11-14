import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_service/auth.service';

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

  ngOnInit() {
    // ดึงค่าจาก local storage และกำหนดให้กับตัวแปร
  this.name = localStorage.getItem('name') || ''; // หากเป็น null กำหนดเป็นสตริงว่าง
  this.email = localStorage.getItem('email') || '';
  this.role = localStorage.getItem('role') || '';
  this.level = localStorage.getItem('level') || '';
  this.group = localStorage.getItem('group') || '';
  }
}
