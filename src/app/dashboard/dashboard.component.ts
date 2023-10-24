import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  device_id: string = '';

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.device_id = this.route.snapshot.queryParamMap.get('device_id') || '';
  }

  
}
