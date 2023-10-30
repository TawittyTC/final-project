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
  public chartData: any[] = [];
  device_id: string = '';
  dataSubscription: Subscription | undefined;
  data: any = {};
  totalEnergy: number = 0; // เพิ่มตัวแปร totalEnergy และกำหนดค่าเริ่มต้น

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit(): void {
    this.device_id = this.route.snapshot.queryParamMap.get('device_id') || '';
    this.fetchData();
    this.fetchData1(); // เรียก fetchData1 ด้วยวงเล็บเปิดและปิด

    this.dataSubscription = interval(5000).subscribe(() => {
      this.fetchData();
      this.fetchData1(); // เรียก fetchData1 ด้วยวงเล็บเปิดและปิด
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
        this.data = data;
        console.log(data);
      },
      (error) => {
        console.error('เกิดข้อผิดพลาดในการดึงข้อมูล:', error);
      }
    );
  }

  fetchData1() {
    this.http.get<any[]>(`http://localhost:3000/energy?device_id=${this.device_id}`).subscribe(data => {
      this.chartData = data;

      const totalEnergy = this.chartData.reduce((total, dataPoint) => total + dataPoint.energy, 0);
      console.log(`Total Energy: ${totalEnergy} kWh`);
      this.totalEnergy = totalEnergy.toFixed(3); // อัพเดทค่า totalEnergy

    });
  }
}
