import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-device-card',
  templateUrl: './device-card.component.html',
  styleUrls: ['./device-card.component.scss']
})
export class DeviceCardComponent implements OnInit, OnDestroy {
  device_id: string[] = [];
  latestDeviceData: any = {};

  private dataSubscription: Subscription | undefined;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.fetchData();

    this.dataSubscription = interval(1000).subscribe(() => {
      this.fetchData();
    });
  }

  ngOnDestroy(): void {
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe(); // เลิกรับข้อมูลเมื่อออกจากหน้า
    }
  }

  fetchData() {
    this.http.get<any[]>('http://localhost:3000/devices').subscribe(data => {
      this.device_id = [...new Set(data.map(item => item.device_id))];

      this.latestDeviceData = {};
      this.device_id.forEach(id => {
        const filteredData = data.filter(item => item.device_id === id);
        const latestEntry = filteredData.reduce((prev, current) => (prev.id > current.id) ? prev : current);
        this.latestDeviceData[id] = latestEntry;
      });
    });
  }
}
