import { Component, OnInit, ViewChild, OnDestroy } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { interval, Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

import {
  ApexNonAxisChartSeries,
  ApexPlotOptions,
  ApexChart,
  ApexFill,
  ChartComponent,
  ApexStroke
} from "ng-apexcharts";

@Component({
  selector: 'app-circle-chart',
  templateUrl: './circle-chart.component.html',
  styleUrls: ['./circle-chart.component.scss']
})
export class CircleChartComponent implements OnInit, OnDestroy {
  @ViewChild("chart") chart!: ChartComponent;

  device_id: string = '';
  chartOptions: any;
  energy: number = 0;
  dataSubscription: Subscription | undefined;

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit(): void {
    this.device_id = this.route.snapshot.queryParamMap.get('device_id') || '';

    this.chartOptions = {
      series: [this.energy], // ใช้ this.energy ใน series เพื่อแสดงข้อมูลได้
      chart: {
        height: 270,
        type: "radialBar",
        toolbar: {
          show: true
        }
      },
      plotOptions: {
        radialBar: {
          hollow: {
            size: "70%",
          },
          dataLabels: {
            name: {
              show: false,
            },
            value: {
              show: true,
              fontSize: "50px",
              formatter: function (val: number) {
                return val.toFixed(2) + "";
              },
            },
          },
        },
      },
      labels: ['Energy'],
    };

    this.fetchData();

    this.dataSubscription = interval(5000).subscribe(() => {
      this.fetchData();
    });
  }

  ngOnDestroy(): void {
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }
  }
  fetchData() {
    const apiUrl = `http://localhost:3000/latest_data?device_id=${this.device_id}`;

    this.http.get<any[]>(apiUrl).subscribe((data) => {

      if (data && data.length > 0) {
        this.energy = data[0].energy; // รับข้อมูล energy จาก API

        // อัพเดตข้อมูลในกราฟ
        this.chart.updateOptions({
          series: [this.energy],
        });

      }
    });
  }






}
