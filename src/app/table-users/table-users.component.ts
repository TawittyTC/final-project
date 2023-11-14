// table-users.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { interval, Subscription } from 'rxjs';
import { ApiService } from '../_service/api.service';

@Component({
  selector: 'app-table-users',
  templateUrl: './table-users.component.html',
  styleUrls: ['./table-users.component.scss']
})
export class TableUsersComponent implements OnInit, OnDestroy {
  users: any[] = [];
  devices: any[] = [];
  editedUser: any = {};
  editMode = false;
  private dataSubscription: Subscription | undefined;
  originalUser: any = {};
  selectedDevice: string = '';
  originalAccessArray: string[] = [];

  constructor(private apiService: ApiService) {
  }

  ngOnInit(): void {
    this.loadUsers();
    this.loadDevices();
    this.dataSubscription = interval(2000).subscribe(() => {
      this.loadUsers();
      this.loadDevices();
      //console.log(this.devices)
    });
  }

  ngOnDestroy() {
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }
  }

  loadDevices() {
    this.apiService.getAllData().subscribe((response: any) => {
      this.devices = response.map((item: { device_id: any }) => item.device_id.toString());
    });
  }

  loadUsers() {
    this.apiService.getAllUsers().subscribe(
      (response: any) => {
        this.users = response.map((user: any) => ({
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          access: user.access,
          accessArray: user.access ? user.access.split(',').map((item: string) => item.trim()) : []  // Check if access is null or empty
        }));
      },
      (error) => {
        console.error('Error loading users:', error);
        // Handle error as needed
      }
    );
  }

  editUser(email: string) {
    const userToEdit = this.users.find(user => user.email === email);
    this.originalUser = { ...userToEdit };
    this.editedUser = { ...this.originalUser };
    this.originalAccessArray = [...this.editedUser.accessArray];
    this.editMode = true;
  }

  saveUser() {
    // Convert the accessArray to a comma-separated string
    const accessString = this.editedUser.accessArray.join(',');

    // Update the user on the server
    this.apiService.updateUserByEmail(this.originalUser.email, {
      ...this.editedUser,
      access: accessString || null  // Set access to null if accessString is empty
    }).subscribe(
      () => {
        console.log('User updated successfully.');
        this.loadUsers(); // Refresh the user list
        this.editMode = false; // Exit edit mode
      },
      (error) => {
        console.error('Error updating user:', error);
        // Revert changes in case of an error
        this.editedUser.accessArray = [...this.originalAccessArray];
      }
    );
  }

  addDevice() {
    if (this.selectedDevice && !this.editedUser.accessArray.includes(this.selectedDevice)) {
      this.editedUser.accessArray.push(this.selectedDevice);
      this.selectedDevice = '';
    }
  }

  removeDevice(index: number) {
    if (index >= 0 && index < this.editedUser.accessArray.length) {
      this.editedUser.accessArray.splice(index, 1);
    }
  }

  deleteUser(email: string) {
    if (confirm('Are you sure you want to delete this user?')) {
      this.apiService.deleteUserByEmail(email).subscribe(
        () => {
          console.log('User deleted successfully.');
          this.loadUsers();
        },
        (error) => {
          console.error('Error deleting user:', error);
        }
      );
    }
  }

  cancelEditMode() {
    this.editMode = false;
    this.editedUser = { ...this.originalUser };
    this.editedUser.accessArray = [...this.originalAccessArray];
    this.selectedDevice = '';
  }
}
