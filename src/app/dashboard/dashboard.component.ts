import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  device_id: string = '';
  dataSubscription: Subscription | undefined;
  data: any = {}; // เพิ่มตัวแปร data สำหรับเก็บข้อมูล

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit(): void {
    this.device_id = this.route.snapshot.queryParamMap.get('device_id') || '';
    this.fetchData();

    this.dataSubscription = interval(5000).subscribe(() => {
      this.fetchData();
    });
  }

  ngOnDestroy(): void {
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }
  }

  fetchData() {
    const apiUrl = `http://localhost:3000/latest_data?device_id=${this.device_id}`;

    this.http.get<any[]>(apiUrl).subscribe(
      (data) => {

        this.data = data; // บันทึกข้อมูลที่ได้รับในตัวแปร data
        console.log(data);
      },
      (error) => {
        console.error('เกิดข้อผิดพลาดในการดึงข้อมูล:', error);
      }
    );
  }
}
