import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';  // ต้องมีการ import HttpClient
import { interval, Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../_service/api.service';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnInit, OnDestroy {
  public chartData: any[] = [];
  public chartOptions: any;
  public chartOptions2: any;
  device_id: string = '';
  dataSubscription: Subscription | undefined;
  unitCost: number = 0;
  level: number = 1 ;

  constructor(private route: ActivatedRoute,private http: HttpClient,private apiService: ApiService) {
  }

  ngOnInit() {
    this.device_id = this.route.snapshot.queryParamMap.get('device_id') || '';
    this.fetchData();
    this.fetchUnitCost(); // เรียกใช้งานฟังก์ชันเพื่อดึงค่า Unit Cost

   // กำหนดรอรับค่า unitCost จาก API ก่อนจึงจะเรียก fetchData()
  this.dataSubscription = interval(5000).subscribe(() => {
    if (this.unitCost !== 0) {
      this.fetchData();
    }

    });
  }

  generateChart() {
    // ทำการสร้างและกำหนดตัวเลือกสำหรับกราฟโดยใช้ ng-apexcharts
    this.chartOptions = {
      series: [{
        name: "Energy",
        data: this.chartData.map(item => ({
          x: new Date(item.created_timestamp).getTime(),
          y: item.energy
        }))
      }],
      chart: {
        id: 'line-2',
        group: 'social',
        type: 'line',
        height: 450, // เพิ่มความสูงของกราฟ
        animations: {
          enabled: true,
          easing: 'linear',
          dynamicAnimation: {
            speed: 2000
          }
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
            month: 'MMM \'yy',
            day: 'dd MMM',
            hour: 'HH',
            minute: 'mm',
            second: 'ss'
          }
        }
      },
      yaxis: [
          {
              title: {
                  text: 'Energy (Khw)'
              },
              labels: {
                  formatter: function (value: number) {
                      return 'Khw' + value.toFixed(2); // Add "฿" as the currency symbol
                  }
              }
          },
      ],
      dataLabels: {
        enabled: true, // แสดงข้อมูลแต่ละจุด
        style: {
          fontSize: '12px',
          colors: ['#333']
        },
        background: {
          enabled: true,
          foreColor: '#fff',
          borderRadius: 3,
          padding: 5
        },
        textAnchor: 'middle', // แสดงข้อมูลในกลางของจุด
      },
      markers: {
        size: 6,
        hover: {
          size: 10
        }
      },
      tooltip: {
        enabled: true,
        style: {
          fontSize: '12px',
        },
        y: {
          formatter: function (value: number) {
            return value.toFixed(2); // แสดงค่าใน tooltip ในรูปแบบทศนิยม
          }
        }
      }
    };
  }



  generateChart2() {
    // Calculate cost of electricity and add it to the data
    const chartDataWithCost = this.chartData.map((item: { created_timestamp: string | number | Date; energy: number; }) => ({
        x: new Date(item.created_timestamp).getTime(),
        y: item.energy,
        cost: item.energy * this.unitCost  // Calculate the cost of electricity
    }));

    // Create and set options for the chart using ng-apexcharts
    this.chartOptions2 = {
        series: [
            {
                name: "Cost",
                data: chartDataWithCost.map((item: { x: any; cost: any; }) => ({
                    x: item.x,
                    y: item.cost
                })),
                color: '#00D41A' // เพิ่มสีเขียวที่นี่
            }
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
                    speed: 2000
                }
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
                    month: 'MMM \'yy',
                    day: 'dd MMM',
                    hour: 'HH',
                    minute: 'mm',
                    second: 'ss'
                }
            }
        },
        yaxis: [
          {
              title: {
                  text: 'Cost (฿)'
              },
              labels: {
                  formatter: function (value: number) {
                      return '฿' + value.toFixed(2); // Add "฿" as the currency symbol
                  }
              }
          },
      ],

        dataLabels: {
            enabled: true, // Show data labels for each point
            style: {
                fontSize: '12px',
                colors: ['#333']
            },
            background: {
                enabled: true,
                foreColor: '#fff',
                borderRadius: 3,
                padding: 5
            },
            textAnchor: 'middle', // Show data labels in the middle of data points
        },
        markers: {
            size: 6,
            hover: {
                size: 10
            }
        },
        tooltip: {
            enabled: true,
            style: {
                fontSize: '12px',
            },
            y: [
                {
                    formatter: function (value: number) {
                        return value.toFixed(2); // Display values in the tooltip with two decimal places
                    }
                },
                {
                    formatter: function (value: number) {
                        return value.toFixed(2); // Display values in the tooltip with two decimal places
                    }
                }
            ]
        }
    };
}

  ngOnDestroy(): void {
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }
  }
  fetchData() {
    // Use ApiService to fetch energy data
    this.apiService.getEnergyData(this.device_id).subscribe((data) => {
      this.chartData = data;
      console.log(this.chartData);
  
      // Call methods to generate charts
      this.generateChart();
      this.generateChart2();
  
      // Calculate total energy
      const totalEnergy = this.chartData.reduce((total, dataPoint) => total + dataPoint.energy, 0);
    });
  }
  
  // Replace fetchUnitCost with ApiService method
  fetchUnitCost() {
    this.apiService.getUnitCost().subscribe(
      (response: any) => {
        if (typeof response === 'number') {
          // Handle the case where the response is a number
          this.unitCost = response;
          console.log('UnitCost: คือ:', this.unitCost);
        } else {
          // Handle the case where the response is an array
          if (response.length > 0) {
            this.unitCost = response[0].unitCost;
            console.log('UnitCost: คือ:', this.unitCost);
          }
        }
      },
      (error) => {
        console.error('Error fetching Unit Cost:', error);
      }
    );
  }
}
