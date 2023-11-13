import { Component, OnInit, OnDestroy } from '@angular/core';
import { interval, Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-table-groups',
  templateUrl: './table-groups.component.html',
  styleUrls: ['./table-groups.component.scss']
})
export class TableGroupsComponent implements OnInit, OnDestroy {
  deviceData: any[] = [];
  device_id: string[] = [];
  newData: any = {};
  addMode: boolean = false;
  editMode: boolean = false;
  editedData: any = {};

  dataSubscription: Subscription | undefined;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadData();

    // Use interval to periodically fetch data from the backend
    this.dataSubscription = interval(2000).subscribe(() => {
      this.loadData();
    });
  }

  ngOnDestroy() {
    // Unsubscribe when the component is destroyed
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }
  }

  loadData() {
    // Call the API directly in the component
    this.http.get<any[]>('http://localhost:3000/devices').subscribe((response: any) => {
      this.deviceData = response;
      this.device_id = this.deviceData.map((item: { device_id: any }) =>
        item.device_id.toString()
      );
    });
  }

  createNewData() {
    // Call the API directly in the component
    this.http.post('http://localhost:3000/devices', this.newData).subscribe(() => {
      this.loadData();
      this.newData = {};
      this.addMode = false;
    });
  }

  updateData() {
    if (this.formIsValid) {
      // Call the API directly in the component
      this.http.put(`http://localhost:3000/devices/${this.editedData.device_id}`, this.editedData).subscribe(
        () => {
          this.editMode = false;
          this.editedData = {};
        },
        (error: any) => {
          console.error('Error updating data:', error);
        }
      );
    }
  }

  deleteData(device_id: string) {
    const confirmed = confirm('Are you sure you want to delete this data?');
    if (confirmed) {
      // Call the API directly in the component
      this.http.delete(`http://localhost:3000/devices/${device_id}`).subscribe(() => {
        this.loadData();
      });
    }
  }

  setEditedData(deviceGroup: any) {
    this.editedData = { ...deviceGroup };
  }

  get formIsValid(): boolean {
    return (
      this.editedData.device_name &&
      this.editedData.device_detail &&
      this.editedData.device_location &&
      this.editedData.device_type &&
      this.editedData.group_id
    );
  }

  onFileSelected(event: any) {
    // Handle file selection logic
  }

  cancelEditMode() {
    this.editMode = false;
    this.editedData = {};
  }
}
