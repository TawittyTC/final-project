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
  constructor(
    private apiService: ApiService,
    private groupService: GroupService
  ) {}

  ngOnInit() {
    this.fetchAllData();
    this.getAllDataGroup();
    this.getLatestAllEnergy();
    this.getLastestEnergyByGroupName(this.selectedGroup);
    this.getDataByGroupName(this.selectedGroup);
    this.fetchUnitCost();


    this.groupService.selectedGroup$.subscribe((selectedGroup: string) => {
      this.selectedGroup = selectedGroup;
      console.log(this.selectedGroup);

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
      // Update the selectedGroup if it's not in the available groups
      if (!this.apiGroups.includes(this.selectedGroup)) {
        this.selectedGroup = ''; // or set it to the first available group
      }
    });
  });

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
    // Calculate cost of electricity and add it to the data
    const chartDataWithCost = this.chartData.map(
      (item: {
        created_timestamp: string | number | Date;
        energy: number;
      }) => ({
        x: new Date(item.created_timestamp).getTime(),
        y: item.energy,
        cost: item.energy * this.unitCost, // Calculate the cost of electricity
      })
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

  ngOnDestroy(): void {
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }
  }

  fetchData() {
    if (!this.selectedGroup) {
      // Handle when no group is selected
      this.chartData = []; // or set it to an appropriate default value
      this.generateChart();
      this.generateChart2();
      this.totalEnergy = '';
      this.cost = 0;
      return;
    }
  
    this.apiService.getAllDataByGroupName(this.selectedGroup).subscribe((data) => {
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
      (response: any) => {
        if (typeof response === 'number') {
          // Handle the case where the response is a number
          this.unitCost = response;
          //console.log('UnitCost: คือ:', this.unitCost);
        } else {
          // Handle the case where the response is an array
          if (response.length > 0) {
            this.unitCost = response[0].unitCost;
            //console.log('UnitCost: คือ:', this.unitCost);
          }
        }

        // After getting the unitCost, fetch data
        this.fetchData();
        this.fetchAllData();
      },
      (error) => {
        console.error('Error fetching Unit Cost:', error);
      }
    );
  }

  // fetchEnergyData() {
  //   this.apiService.getEnergyData(this.device_id).subscribe((data: any[]) => {
  //     this.chartData = data;

  //     const totalEnergy = this.chartData.reduce(
  //       (total, dataPoint) => total + dataPoint.energy,
  //       0
  //     );
  //     //console.log(`Total Energy: ${totalEnergy} kWh`);
  //     this.totalEnergy = totalEnergy.toFixed(3);

  //     this.cost = totalEnergy * this.unitCost;
  //     this.cost = +this.cost.toFixed(3);
  //   });
  // }
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
  
    const group = this.apiGroups.find(group => group.group_id === groupId);
    this.selectedGroupName = group ? group.group_name : 'Devices';
  }
  
  
  getAllDataGroup(): void {
    this.apiService.getAllDataGroup().subscribe((data) => {
      this.allDataGroup = data;
      //console.log('allDataGroup : ',this.allDataGroup)
      // ทำอะไรกับข้อมูลหลังจากได้รับมา เช่น การแสดงผลหรือประมวลผลต่อ
    });
  }

  getLatestAllEnergy(): void {
    this.apiService.getLatestAllEnergy().subscribe((data) => {
      this.latestAllEnergy = data;
      //console.log('latestAllEnergy : ',this.latestAllEnergy)
    });
  }

  getLastestEnergyByGroupName(selectedGroup: string): void {
    if(selectedGroup) {
      // Call the API to get the latest energy by group name
      this.apiService.getLastestEnergyByGroupName(selectedGroup).subscribe((data) => {
        this.latestAllEnergy = data;
        console.log('latestEnergyByGroupName : ', this.latestAllEnergy);
      });
    } else {
      // Handle the case when no group ID is provided
      console.log('No group ID provided');
      // You might want to update the UI or perform other actions here
    }
  }
  
  getDataByGroupName(selectedGroup: string): void {
    if(selectedGroup) {
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
  
}
