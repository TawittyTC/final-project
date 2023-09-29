import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  device_id: string = ''; // กำหนดค่าเริ่มต้นเป็นสตริงว่าง

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    // ดึงค่า device_id จาก query parameter
    const device_id = this.route.snapshot.queryParamMap.get('device_id');
    if (device_id !== null) {
      this.device_id = device_id; // กำหนดค่าเฉพาะเมื่อ device_id ไม่ใช่ null
    }
  }
}
