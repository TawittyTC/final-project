import { Component, OnInit } from '@angular/core';
import { ApiService } from '../_service/api.service';
@Component({
  selector: 'app-all-dashboard',
  templateUrl: './all-dashboard.component.html',
  styleUrls: ['./all-dashboard.component.scss']
})
export class AllDashboardComponent implements OnInit {
  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    // Example usage of ApiService methods
    this.getDataByGroupName('exampleGroupName');
    this.getAllData();
    // Call other methods as needed...
  }

  getDataByGroupName(groupName: string): void {
    this.apiService.getDataByGroupName(groupName).subscribe(
      (data) => {
        // Handle the data received from the API
        console.log('Data by group name:', data);
      },
      (error) => {
        // Handle errors if any
        console.error('Error fetching data by group name:', error);
      }
    );
  }

  getAllData(): void {
    this.apiService.getAllDataGroup().subscribe(
      (data) => {
        // Handle the data received from the API
        console.log('All data:', data);
      },
      (error) => {
        // Handle errors if any
        console.error('Error fetching all data:', error);
      }
    );
  }
}
