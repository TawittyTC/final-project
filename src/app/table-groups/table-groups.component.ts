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
  group_id: string[] = []; // Update to use group_id
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
    this.http.get<any[]>('http://localhost:3000/device-groups').subscribe((response: any) => {
      this.deviceData = response;
      this.group_id = this.deviceData.map((item: { group_id: any }) =>
        item.group_id.toString()
      );
    });
  }

  createNewData() {
    // Call the API directly in the component
    this.http.post('http://localhost:3000/device-groups', this.newData).subscribe(() => {
      this.loadData();
      this.newData = {};
      this.addMode = false;
    });
  }

  updateData() {
    console.log('Before Update:', this.editedData);


      // Call the API directly in the component
      this.http.put(`http://localhost:3000/device-groups/${this.editedData.group_id}`, this.editedData).subscribe(
        () => {
          this.editMode = false;
          this.editedData = {};
          console.log('After Update:', this.editedData);
          console.log('Update successful');
        },
        (error: any) => {
          console.error('Error updating data:', error);
        }
      );
  }



  deleteData(group_id: string) {
    const confirmed = confirm('Are you sure you want to delete this data?');
    if (confirmed) {
      // Call the API directly in the component
      this.http.delete(`http://localhost:3000/device-groups/${group_id}`).subscribe(() => {
        this.loadData();
        console.log("Delete Complete");
      });
    }
  }

  setEditedData(deviceGroup: any) {
    this.editedData = { ...deviceGroup };
  }

  get formIsValid(): boolean {
    return (
      this.editedData.group_name && // Update to use group_name
      this.editedData.group_detail && // Adjust property names accordingly
      this.editedData.group_location &&
      this.editedData.group_type &&
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
