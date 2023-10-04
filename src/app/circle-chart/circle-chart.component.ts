import { Component, OnInit, ViewChild, OnDestroy } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { interval, Subscription } from 'rxjs'; // เพิ่ม Subscription
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
export class CircleChartComponent implements OnInit, OnDestroy { // เพิ่ม OnDestroy
  @ViewChild("chart") chart!: ChartComponent;

  device_id: string = '';
  chartOptions: any;
  energy: number = 0;
  dataSubscription: Subscription | undefined; // เพิ่ม Subscription

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit(): void {
    this.device_id = this.route.snapshot.queryParamMap.get('device_id') || '';

    this.chartOptions = {
      series: [this.energy],
      chart: {
        height: 350,
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
              fontSize: "36px",
              formatter: function (val: number) {
                return val.toFixed(2) + "%";
              },
            },
          },
        },
      },
      labels: ['Energy'],
    };

    this.fetchData();

    this.dataSubscription = interval(1000).subscribe(() => {
      this.fetchData();
    });
  }

  ngOnDestroy(): void {
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe(); // เลิกรับข้อมูลเมื่อออกจากหน้า
    }
  }

  fetchData() {
    const apiUrl = `http://localhost:3000/latestData?device_id=${this.device_id}`;

    this.http.get<any[]>(apiUrl).subscribe(data => {
      console.log(data);
    });
  }
}
