import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';  // ต้องมีการ import HttpClient
import { interval, Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnInit {
  public chartData: any[] = [];
  public chartOptions: any;
  public chartOptions2: any;
  device_id: string = '';

  constructor(private route: ActivatedRoute,private http: HttpClient) {
  }

  ngOnInit() {
    this.device_id = this.route.snapshot.queryParamMap.get('device_id') || '';
    this.fetchData();
      // เรียกเมธอดสร้างกราฟ
      //this.generateChart();
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
          text: 'Energy'
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
          text: 'Energy'
        }
      }
    };
  }
  fetchData() {
    // ดึงข้อมูลจาก API โดยใช้ค่า device_id จากตัวแปร
    this.http.get<any[]>(`http://localhost:3000/energy?device_id=${this.device_id}`).subscribe(data => {
      this.chartData = data;
      console.log(this.chartData)
      // เรียกเมธอดสร้างกราฟ
      this.generateChart();
      this.generateChart2()
    });
  }
  
}
