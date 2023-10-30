import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';  // ต้องมีการ import HttpClient
import { interval, Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

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

  constructor(private route: ActivatedRoute,private http: HttpClient) {
  }

  ngOnInit() {
    this.device_id = this.route.snapshot.queryParamMap.get('device_id') || '';
    this.fetchData();
  
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
      yaxis: {
        title: {
          text: 'Energy'
        },
        labels: {
          formatter: function (value: number) {
            return value.toFixed(2); // แสดงค่าของ y-axis ในรูปแบบทศนิยม
          }
        }
      },
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
    // ทำการสร้างและกำหนดตัวเลือกสำหรับกราฟโดยใช้ ng-apexcharts
    this.chartOptions2 = {
      series: [{
        name: "Energy",
        data: this.chartData.map(item => ({
          x: new Date(item.created_timestamp).getTime(),
          y: item.energy
        }))
      }],
      chart: {
        type: 'line',
        height: 350,
        animations: {
          enabled: true,
          easing: 'linear',
          dynamicAnimation: {
            speed: 2000
          }
        }
      },
      xaxis: {
        type: 'datetime',
        labels: {
          format: 'dd MMM yyyy'
        }
      },
      yaxis: {
        title: {
          text: 'Cost'
        }
      }
    };
  }

  ngOnDestroy(): void {
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }
  }
  fetchData() {
    // ดึงข้อมูลจาก API โดยใช้ค่า device_id จากตัวแปร
    this.http.get<any[]>(`http://localhost:3000/energy?device_id=${this.device_id}`).subscribe(data => {
      this.chartData = data;
      console.log(this.chartData)
      // เรียกเมธอดสร้างกราฟ
      this.generateChart();
      this.generateChart2()

      // คำนวณค่าไฟรวม
    const totalEnergy = this.chartData.reduce((total, dataPoint) => total + dataPoint.energy, 0);
    console.log(`Total Energy: ${totalEnergy} kWh`);
    });
  }
  
}
