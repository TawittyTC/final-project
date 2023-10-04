import { Component, Input, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {interval } from 'rxjs'

@Component({
  selector: 'app-device-card',
  templateUrl: './device-card.component.html',
  styleUrls: ['./device-card.component.scss']
})
export class DeviceCardComponent implements OnInit {
  device_id: string[] = []; // สร้างตัวแปรเก็บ device_id
  latestDeviceData: any = {}; // สร้างตัวแปรเพื่อเก็บข้อมูลอุปกรณ์ล่าสุด

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.fetchData();

    interval(1000).subscribe(()=>{
      this.fetchData();
    });
  }

  fetchData() {
    this.http.get<any[]>('http://localhost:3000/api/data').subscribe(data => {
      console.log(data); // แสดงข้อมูลที่ได้รับจาก API ในคอนโซล
      this.device_id = [...new Set(data.map(item => item.device_id))]; // รวบข้อมูล device_id เดียวกัน

      // หาข้อมูลตัวล่าสุดจากคอลัมน์ id ในแต่ละ device_id
      this.latestDeviceData = {};
      this.device_id.forEach(id => {
        const filteredData = data.filter(item => item.device_id === id);
        const latestEntry = filteredData.reduce((prev, current) => (prev.id > current.id) ? prev : current);
        this.latestDeviceData[id] = latestEntry;
      });
    });
  }
}
