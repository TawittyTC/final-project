import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http'; // ต้องมีการ import HttpClient
import { interval, Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../_service/api.service';
import { GroupService } from '../_service/group.service';

@Component({
  selector: 'app-all-dashboard',
  templateUrl: './all-dashboard.component.html',
  styleUrls: ['./all-dashboard.component.scss'],
})
export class AllDashboardComponent implements OnInit, OnDestroy {
  public chartData: any[] = [];
  public chartOptions: any = {};
  public chartOptions2: any = {};
  device_id: string = '';
  dataSubscription: Subscription | undefined;
  unitCost: number = 0;
  level: number = 1;
  totalEnergy: string = '';
  cost: number = 0;
  apiGroups: any[] = [];
  selectedGroup: string = '';
  data: any[] = [];
  groups: string[] = [''];
  showGroupDropdown: boolean = false;
  groupData: any = {};
  allDataGroup: any = {};
  latestAllEnergy: any = {};
  latestEnergyByGroupName: any = {};
  selectedGroupName: string = '';
  shouldRefreshGraph: boolean = true;
  selectedValue: string = '';
  unitCosts: any[] = [];
  start: any;
  end: any;
  constructor(
    private apiService: ApiService,
    private groupService: GroupService
  ) {}

  ngOnInit() {
    // this.fetchAllData();
    this.getAllDataGroup();
    this.getLatestAllEnergy();
    // this.getLastestEnergyByGroupName(this.selectedGroup);
    // this.getDataByGroupName(this.selectedGroup);
    this.fetchUnitCost();
    this.groupService.selectedGroup$.subscribe((selectedGroup: string) => {
      this.selectedGroup = selectedGroup;
      // console.log('No. ' , this.selectedGroup);

      // Always fetch groups to update the dropdown
      this.apiService.getAllGroups().subscribe((groups: string[]) => {
        this.apiGroups = groups;
        if (selectedGroup) {
          this.getGroupName(selectedGroup);
        } else {
          // When no group is selected or returning to the page, show "Devices"
          this.selectedGroupName = 'Devices';
        }
      });

      // If there is a selectedGroup, fetch data
      if (selectedGroup) {
        this.fetchData();
        this.getLastestEnergyByGroupName(selectedGroup);
        this.getDataByGroupName(selectedGroup);
      } else {
        this.allDataGroup = null; // or [] or handle it as appropriate
        this.latestAllEnergy = null; // or {} or handle it as appropriate
        this.selectedGroupName = 'Devices';
      }
    });

    this.dataSubscription = interval(2000).subscribe(() => {
      this.apiService.getAllGroups().subscribe((groups: string[]) => {
        this.apiGroups = groups;
      });
    });
  }
  onSelect(value: string) {
    this.selectedValue = value;
    console.log('Selected Value:', this.selectedValue);
    console.log('Selected Group:', this.selectedGroup);

    if (this.selectedGroup && this.selectedValue) {
      if (this.selectedValue === 'Day') {
        this.fetchData();
      } else if (this.selectedValue === 'Month') {
        this.getAllDataForGroupMonth(this.selectedGroup);
      } else if (this.selectedValue === 'Year') {
        this.getAllDataForGroupYears(this.selectedGroup);
      } else {
        this.fetchData();
      }
    } else if (!this.selectedGroup) {
      if (this.selectedValue === 'Day') {
        this.fetchAllData();
      } else if (this.selectedValue === 'Month') {
        this.fetchAllDataForMonth();
      } else if (this.selectedValue === 'Year') {
        this.fetchAllDataForYears();
      } else {
        this.fetchAllData();
      }
    }
    this.shouldRefreshGraph = false; // Prevent further refresh until needed
  }

  generateChart() {
    // ทำการสร้างและกำหนดตัวเลือกสำหรับกราฟโดยใช้ ng-apexcharts
    this.chartOptions = {
      series: [
        {
          name: 'Energy',
          data: this.chartData.map((item) => ({
            x: new Date(item.created_timestamp).getTime(),
            y: item.energy,
          })),
        },
      ],
      chart: {
        id: 'line-2',
        group: 'social',
        type: 'line',
        height: 450, // เพิ่มความสูงของกราฟ
        animations: {
          enabled: true,
          easing: 'linear',
          dynamicAnimation: {
            speed: 2000,
          },
        },
        zoom: {
          enabled: true, // เปิดใช้งานการซูม
        },
      },
      xaxis: {
        type: 'datetime',
        labels: {
          format: 'dd MMM yyyy HH:mm:ss', // เพิ่มระดับวินาทีในรูปแบบวัน เดือน ปี ชั่วโมง นาที วินาที
          datetimeFormatter: {
            year: 'yyyy',
            month: "MMM 'yy",
            day: 'dd MMM',
            hour: 'HH',
            minute: 'mm',
            second: 'ss',
          },
        },
      },
      yaxis: [
        {
          title: {
            text: 'Energy (Khw)',
          },
          labels: {
            formatter: function (value: number) {
              return 'Khw' + value.toFixed(3); // Add "฿" as the currency symbol
            },
          },
        },
      ],
      dataLabels: {
        enabled: true,
        style: {
          fontSize: '12px',
          colors: ['#333'],
        },
        formatter: function (value: number) {
          return value.toFixed(3); // Show data labels with three decimal places
        },
        background: {
          enabled: false,
          foreColor: '#fff',
          borderRadius: 3,
          padding: 5,
        },
        textAnchor: 'middle',
      },
      markers: {
        size: 6,
        hover: {
          size: 10,
        },
      },
      tooltip: {
        enabled: true,
        style: {
          fontSize: '12px',
        },
        y: {
          formatter: function (value: number) {
            return value.toFixed(3); // แสดงค่าใน tooltip ในรูปแบบทศนิยม
          },
        },
      },
    };
  }
  generateChart2() {
    const chartDataWithCost = this.chartData.map(
      (item: {
        created_timestamp: string | number | Date;
        energy: number;
        cost: number | null; // กำหนด cost เป็น number หรือ null
      }) => {
        const unitCostItem = (this.unitCost as unknown as Array<any>).find(
          (costItem) => costItem.id === 1
        );
        const unitCost = unitCostItem ? unitCostItem.unitCost : 0;
        return {
          x: new Date(item.created_timestamp).getTime(),
          y: item.energy,
          cost:
            item.energy <= 15
              ? item.energy * unitCost
              : item.energy <= 25
              ? 15 * unitCost + (item.energy - 15) * this.getUnitCostById(2)
              : item.energy <= 35
              ? 15 * unitCost +
                10 * this.getUnitCostById(2) +
                (item.energy - 25) * this.getUnitCostById(3)
              : item.energy <= 100
              ? 15 * unitCost +
                10 * this.getUnitCostById(2) +
                10 * this.getUnitCostById(3) +
                (item.energy - 35) * this.getUnitCostById(4)
              : item.energy <= 150
              ? 15 * unitCost +
                10 * this.getUnitCostById(2) +
                10 * this.getUnitCostById(3) +
                65 * this.getUnitCostById(4) +
                (item.energy - 100) * this.getUnitCostById(5)
              : item.energy <= 400
              ? 15 * unitCost +
                10 * this.getUnitCostById(2) +
                10 * this.getUnitCostById(3) +
                65 * this.getUnitCostById(4) +
                50 * this.getUnitCostById(5) +
                (item.energy - 150) * this.getUnitCostById(6)
              : 15 * unitCost +
                10 * this.getUnitCostById(2) +
                10 * this.getUnitCostById(3) +
                65 * this.getUnitCostById(4) +
                50 * this.getUnitCostById(5) +
                250 * this.getUnitCostById(6) +
                (item.energy - 400) * this.getUnitCostById(7),
        };
      }
    );
    // Create and set options for the chart using ng-apexcharts
    this.chartOptions2 = {
      series: [
        {
          name: 'Cost',
          data: chartDataWithCost.map((item: { x: any; cost: any }) => ({
            x: item.x,
            y: item.cost,
          })),
          color: '#00D41A', // เพิ่มสีเขียวที่นี่
        },
      ],
      chart: {
        id: 'line-1',
        group: 'social',
        type: 'line',
        height: 450, // Increase the chart height
        animations: {
          enabled: true,
          easing: 'linear',
          dynamicAnimation: {
            speed: 2000,
          },
        },
        zoom: {
          enabled: true, // Enable zooming
        },
      },
      xaxis: {
        type: 'datetime',
        labels: {
          format: 'dd MMM yyyy HH:mm:ss',
          datetimeFormatter: {
            year: 'yyyy',
            month: "MMM 'yy",
            day: 'dd MMM',
            hour: 'HH',
            minute: 'mm',
            second: 'ss',
          },
        },
      },
      yaxis: [
        {
          title: {
            text: 'Cost (฿)',
          },
          labels: {
            formatter: function (value: number) {
              return '฿' + value.toFixed(3); // Add "฿" as the currency symbol
            },
          },
        },
      ],

      dataLabels: {
        enabled: true,
        style: {
          fontSize: '12px',
          colors: ['#333'],
        },
        formatter: function (value: number) {
          return value.toFixed(3); // Show data labels with three decimal places
        },
        background: {
          enabled: false,
          foreColor: '#fff',
          borderRadius: 3,
          padding: 5,
        },
        textAnchor: 'middle',
      },
      markers: {
        size: 6,
        hover: {
          size: 10,
        },
      },
      tooltip: {
        enabled: true,
        style: {
          fontSize: '12px',
        },
        y: [
          {
            formatter: function (value: number) {
              return value.toFixed(3); // Display values in the tooltip with two decimal places
            },
          },
          {
            formatter: function (value: number) {
              return '฿' + +value.toFixed(3); // Display values in the tooltip with two decimal places
            },
          },
        ],
      },
    };
  }
  getUnitCostById(id: number): number {
    const unitCostItem = (this.unitCost as unknown as Array<any>).find(
      (item) => item.id === id
    );
    return unitCostItem ? unitCostItem.unitCost : 0;
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

  ngOnDestroy(): void {
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }
  }

  fetchData() {
    this.apiService
      .getAllDataByGroupName(this.selectedGroup)
      .subscribe((data) => {
        this.chartData = data;
        console.log('Data from getAllDataByGroupName:', data);

        this.generateChart();
        this.generateChart2();

        const totalEnergy = this.chartData.reduce(
          (total, dataPoint) => total + dataPoint.energy,
          0
        );
        this.totalEnergy = totalEnergy.toFixed(3);

        this.cost = totalEnergy * this.unitCost;
        this.cost = +this.cost.toFixed(3);
      });
  }
  fetchAllData() {
    this.apiService.getAllData().subscribe(
      (data: any[]) => {
        // Assume 'usedEnergy' is the field representing the energy used
        this.chartData = data.map((item: any) => ({
          ...item,
          cost: item.usedEnergy * this.unitCost,
        }));

        console.log('Data from getAllData:', this.chartData);

        // Call methods to generate charts or perform other operations as needed
        this.generateChart();
        this.generateChart2();

        // Calculate total energy
        const totalEnergy = this.chartData.reduce(
          (total, dataPoint) => total + dataPoint.usedEnergy,
          0
        );
        this.totalEnergy = totalEnergy.toFixed(3);

        // Perform cost calculation only after the totalEnergy is calculated
        this.cost = totalEnergy * this.unitCost;
        this.cost = +this.cost.toFixed(3);
      },
      (error) => {
        console.error('Error fetching all data:', error);
        // Handle errors gracefully here, such as displaying a message to the user
      }
    );
  }
  fetchUnitCost() {
    this.apiService.getUnitCost().subscribe(
      (response: number) => {
        // แก้ไขตรงนี้เป็น number
        this.unitCost = response;
        console.log('UnitCost: คือ:', this.unitCost);

        // After getting the unitCost, fetch data
        this.fetchData();
        this.fetchAllData();
      },
      (error) => {
        console.error('Error fetching Unit Cost:', error);
      }
    );
  }

  reloadPage() {
    // รีโหลดหน้าเว็บ
    location.reload();
  }
  // ฟังก์ชันเลือกกลุ่ม
  selectGroup(group_id: string) {
    this.selectedGroup = group_id;
    this.groupService.setSelectedGroup(group_id);

    // Retrieve and display the group name when a group is selected
    this.getGroupName(this.selectedGroup);
  }

  getGroupName(groupId: string | null): void {
    if (!groupId) {
      // Set the default name to "Devices" if no group ID is provided
      this.selectedGroupName = 'Devices';
      return;
    }

    const group = this.apiGroups.find((group) => group.group_id === groupId);
    this.selectedGroupName = group ? group.group_name : 'Devices';
  }

  //ดึงทั้งหมด แล้วคำนวน //โดยไม่ได้สนgroup  โดยมีค่าเฉลี่ยของ แรงดัน กระแส กำลังไฟ และ ผลรวมของ energy
  getAllDataGroup(): void {
    this.apiService.getAllDataGroup().subscribe((data) => {
      this.allDataGroup = data;
      console.log('allDataGroup : ', this.allDataGroup);
    });
  }
  // ดึงข้อมูลล่าสุด energy ของอุปกรณ์ทั้งหมด และ ทำการ summ
  getLatestAllEnergy(): void {
    this.apiService.getLatestAllEnergy().subscribe((data) => {
      this.latestAllEnergy = data;
      //console.log('latestAllEnergy : ',this.latestAllEnergy)
    });
  }
  // ดึงข้อมูลล่าสุด energy ของอุปกรณ์แต่ละกลุ่ม และ ทำการ summ
  getLastestEnergyByGroupName(selectedGroup: string): void {
    if (selectedGroup) {
      // Call the API to get the latest energy by group name
      this.apiService
        .getLastestEnergyByGroupName(selectedGroup)
        .subscribe((data) => {
          this.latestAllEnergy = data;
          console.log('latestEnergyByGroupName : ', this.latestAllEnergy);
        });
    } else {
      // Handle the case when no group ID is provided
      console.log('No group ID provided');
      // You might want to update the UI or perform other actions here
    }
  }
  //ข้อมูลรวมล่าสุดของ group นั้นๆ โดยมีค่าเฉลี่ยของ แรงดัน กระแส กำลังไฟ และ ผลรวมของ energy
  getDataByGroupName(selectedGroup: string): void {
    if (selectedGroup) {
      // Call the API to get data by group name
      this.apiService.getDataByGroupName(selectedGroup).subscribe((data) => {
        this.allDataGroup = data;
        console.log('groupData : ', this.allDataGroup);
      });
    } else {
      // Handle the case when no group ID is provided
      console.log('No group ID provided');
      // You might want to update the UI or perform other actions here
    }
  }

  //ดึงข้อมูลทั้งหมด ตาม group_name ใช้แสดงในกราฟ แสดงข้อมูล 1 เดือน ทุก 1วัน แสดงกราฟ
  getAllDataForGroupMonth(groupId: string): void {
    this.apiService.getAllDataForGroupMonth(groupId).subscribe(
      (data: any[]) => {
        // ประมวลผลข้อมูลที่ได้รับ
        this.chartData = data.map((item: any) => ({
          ...item,
          cost: item.usedEnergy * this.unitCost,
        }));
        console.log('Data from getAll Data For Group Month:', this.chartData);

        // แสดงข้อมูลที่ได้รับในรูปแบบของกราฟ
        this.generateChart();
        this.generateChart2();

        // คำนวณและแสดงผลรวมพลังงานที่ใช้
        const totalEnergy = this.chartData.reduce(
          (total, dataPoint) => total + dataPoint.usedEnergy,
          0
        );
        this.totalEnergy = totalEnergy.toFixed(3);

        // คำนวณและแสดงค่าใช้จ่าย
        this.cost = totalEnergy * this.unitCost;
        this.cost = +this.cost.toFixed(3);
      },
      (error) => {
        console.error('Error fetching all data for group month:', error);
      }
    );
  }

  //ดึงข้อมูลทั้งหมด ตาม group_name ใช้แสดงในกราฟ แสดงข้อมูล 1 ปี ทุก 1เดือน แสดงกราฟ
  getAllDataForGroupYears(groupId: string): void {
    this.apiService.getAllDataForGroupYears(groupId).subscribe(
      (data: any[]) => {
        // ประมวลผลข้อมูลที่ได้รับ
        this.chartData = data.map((item: any) => ({
          ...item,
          cost: item.usedEnergy * this.unitCost,
        }));
        console.log('Data from getAll Data For Group Years:', this.chartData);

        // แสดงข้อมูลที่ได้รับในรูปแบบของกราฟ
        this.generateChart();
        this.generateChart2();

        // คำนวณและแสดงผลรวมพลังงานที่ใช้
        const totalEnergy = this.chartData.reduce(
          (total, dataPoint) => total + dataPoint.usedEnergy,
          0
        );
        this.totalEnergy = totalEnergy.toFixed(3);

        // คำนวณและแสดงค่าใช้จ่าย
        this.cost = totalEnergy * this.unitCost;
        this.cost = +this.cost.toFixed(3);
      },
      (error) => {
        console.error('Error fetching all data for group years:', error);
      }
    );
  }
  fetchAllDataForMonth() {
    this.apiService.getAllDataForMonth().subscribe(
      (data: any[]) => {
        this.chartData = data.map((item: any) => ({
          ...item,
          cost: item.usedEnergy * this.unitCost,
        }));

        console.log('Data from getAll Data For Month:', this.chartData);

        this.generateChart();
        this.generateChart2();

        const totalEnergy = this.chartData.reduce(
          (total, dataPoint) => total + dataPoint.usedEnergy,
          0
        );
        this.totalEnergy = totalEnergy.toFixed(3);

        this.cost = totalEnergy * this.unitCost;
        this.cost = +this.cost.toFixed(3);
      },
      (error) => {
        console.error('Error fetching data for group month:', error);
      }
    );
  }
  fetchAllDataForYears() {
    this.apiService.getAllDataForYears().subscribe(
      (data: any[]) => {
        this.chartData = data.map((item: any) => ({
          ...item,
          cost: item.usedEnergy * this.unitCost,
        }));

        console.log('Data from getAll Data ForYears:', this.chartData);

        this.generateChart();
        this.generateChart2();

        const totalEnergy = this.chartData.reduce(
          (total, dataPoint) => total + dataPoint.usedEnergy,
          0
        );
        this.totalEnergy = totalEnergy.toFixed(3);

        this.cost = totalEnergy * this.unitCost;
        this.cost = +this.cost.toFixed(3);
      },
      (error) => {
        console.error('Error fetching data for years:', error);
      }
    );
  }
  selectData(start: string, end: string) {
    this.apiService.selectData(start, end).subscribe(
      (res) => {
        this.data = res;
        console.log('selectData : ',this.data);
        this.updateChartData();
      },
      (err) => {
        console.error(err);
      }
    );
  }
  updateChartData() {
    this.chartData = this.data.map((item) => ({
      created_timestamp: item.created_timestamp,
      energy: item.energy,
    }));
    this.generateChart(); // เรียกใช้งานเมธอดเพื่อแสดงผลบน Chart
    this.generateChart2();
  }
  
}
