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

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private apiService: ApiService
  ) {}

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
      (response: number) => {
        // แก้ไขตรงนี้เป็น number
        this.unitCost = response;
        console.log('UnitCost: คือ:', this.unitCost);
      },
      (error) => {
        console.error('Error fetching Unit Cost:', error);
      }
    );
  }

  fetchLatestData() {
    this.apiService.getLatestData(this.device_id).subscribe(
      (data: any[]) => {
        // Change this line
        this.data = data;
        console.log(data);
      },
      (error) => {
        console.error('Error fetching latest data:', error);
      }
    );
  }

  fetchEnergyData() {
    this.apiService.getEnergyData(this.device_id).subscribe((data: any[]) => {
      // Change this line
      this.chartData = data;

      const totalEnergy = this.chartData.reduce(
        (total, dataPoint) => total + dataPoint.energy,
        0
      );
      console.log(`Total Energy: ${totalEnergy} kWh`);
      this.totalEnergy = totalEnergy.toFixed(2);

      this.cost = this.calculateTotalCost(totalEnergy); // Calculate total cost using calculateTotalCost function
      this.cost = +this.cost.toFixed(2);
    });
  }

  calculateTotalCost(totalEnergy: number): number {
    let totalCost = 0;
    if (totalEnergy <= 15) {
      totalCost = totalEnergy * this.getUnitCostById(1);
    } else if (totalEnergy <= 25) {
      totalCost =
        15 * this.getUnitCostById(1) +
        (totalEnergy - 15) * this.getUnitCostById(2);
    } else if (totalEnergy <= 35) {
      totalCost =
        15 * this.getUnitCostById(1) +
        10 * this.getUnitCostById(2) +
        (totalEnergy - 25) * this.getUnitCostById(3);
    } else if (totalEnergy <= 100) {
      totalCost =
        15 * this.getUnitCostById(1) +
        10 * this.getUnitCostById(2) +
        10 * this.getUnitCostById(3) +
        (totalEnergy - 35) * this.getUnitCostById(4);
    } else if (totalEnergy <= 150) {
      totalCost =
        15 * this.getUnitCostById(1) +
        10 * this.getUnitCostById(2) +
        10 * this.getUnitCostById(3) +
        65 * this.getUnitCostById(4) +
        (totalEnergy - 100) * this.getUnitCostById(5);
    } else if (totalEnergy <= 400) {
      totalCost =
        15 * this.getUnitCostById(1) +
        10 * this.getUnitCostById(2) +
        10 * this.getUnitCostById(3) +
        65 * this.getUnitCostById(4) +
        50 * this.getUnitCostById(5) +
        (totalEnergy - 150) * this.getUnitCostById(6);
    } else {
      totalCost =
        15 * this.getUnitCostById(1) +
        10 * this.getUnitCostById(2) +
        10 * this.getUnitCostById(3) +
        65 * this.getUnitCostById(4) +
        50 * this.getUnitCostById(5) +
        250 * this.getUnitCostById(6) +
        (totalEnergy - 400) * this.getUnitCostById(7);
    }
    return totalCost;
  }
  getUnitCostById(id: number): number {
    const unitCostItem = (this.unitCost as unknown as Array<any>).find(
      (item) => item.id === id
    );
    return unitCostItem ? unitCostItem.unitCost : 0;
  }
}
