import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { interval, Subscription } from 'rxjs';
import { ApiService } from 'src/app/api.service';

@Component({
  selector: 'app-device-card',
  templateUrl: './device-card.component.html',
  styleUrls: ['./device-card.component.scss']
})
export class DeviceCardComponent implements OnInit, OnDestroy {
  device_id: [] = [];
  latestDeviceData: any = {};
  editMode = false;
  editedData: any = {};
  newData: any = {};
  addMode = false;
  private dataSubscription: Subscription | undefined;
  data: any;

  constructor(private apiService: ApiService) { }

  ngOnInit() {
    this.loadData();

    // ใช้ interval สำหรับโหลดข้อมูลอัปเดตทุก 2 วินาที
    this.dataSubscription = interval(2000).subscribe(() => {
      this.loadData();
    });
  }

  ngOnDestroy() {
    // ยกเลิกการสมัครสมาชิกเมื่อคอมโพนนิ้งถูกทำลาย
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }
  }

  loadData() {
    this.apiService.getAllData().subscribe((response: any) => {
      this.data = response;
      this.device_id = this.data.map((item: { device_id: any; }) => item.device_id.toString());

      this.latestDeviceData = {};
      this.device_id.forEach(id => {
        const filteredData = this.data.filter((item: { device_id: string; }) => item.device_id === id);
        const latestEntry = filteredData.reduce((prev: { id: number; }, current: { id: number; }) => (prev.id > current.id) ? prev : current);
        this.latestDeviceData[id] = latestEntry;
      });
    });
  }
}
