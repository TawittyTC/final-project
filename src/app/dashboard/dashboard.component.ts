import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { interval, Subscription } from 'rxjs';
import { ApiService } from '../_service/api.service';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, OnDestroy {
  public chartData: any[] = [];
  device_id: string = '';
  dataSubscription: Subscription | undefined;
  data: any = {};
  totalEnergy: number = 0; // เพิ่มตัวแปร totalEnergy และกำหนดค่าเริ่มต้น
  cost: number = 0;
  unitCost: number = 0;

  constructor(private route: ActivatedRoute, private http: HttpClient,private apiService: ApiService) {}



  ngOnInit(): void {
    this.device_id = this.route.snapshot.queryParamMap.get('device_id') || '';
    this.fetchLatestData();
    this.fetchEnergyData(); // เรียก fetchData1 ด้วยวงเล็บเปิดและปิด
    this.fetchUnitCost(); // เรียกใช้งานฟังก์ชันเพื่อดึงค่า Unit Cost


    this.dataSubscription = interval(5000).subscribe(() => {
      this.fetchLatestData();
      this.fetchEnergyData(); // เรียก fetchData1 ด้วยวงเล็บเปิดและปิด
      this.fetchUnitCost();
    });
  }

  ngOnDestroy(): void {
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }
  }

  fetchUnitCost() {
    this.apiService.getUnitCost().subscribe(
      (response: any) => { // Change this line
        if (response.length > 0) {
          this.unitCost = response[0].unitCost;
          console.log('UnitCost: คือ:', this.unitCost);
        }
      },
      (error) => {
        console.error('Error fetching Unit Cost:', error);
      }
    );
  }
  
  fetchLatestData() {
    this.apiService.getLatestData(this.device_id).subscribe(
      (data: any[]) => { // Change this line
        this.data = data;
        console.log(data);
      },
      (error) => {
        console.error('Error fetching latest data:', error);
      }
    );
  }
  
  fetchEnergyData() {
    this.apiService.getEnergyData(this.device_id).subscribe((data: any[]) => { // Change this line
      this.chartData = data;
  
      const totalEnergy = this.chartData.reduce(
        (total, dataPoint) => total + dataPoint.energy,
        0
      );
      console.log(`Total Energy: ${totalEnergy} kWh`);
      this.totalEnergy = totalEnergy.toFixed(3);
  
      this.cost = totalEnergy * this.unitCost;
      this.cost = +this.cost.toFixed(3);
    });
  }
}
