// profile.component.ts

import { Component, OnInit, OnDestroy } from '@angular/core';
import { ApiService } from '../_service/api.service';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit, OnDestroy {
  name: string = '';
  lname: string = '';
  email: string = '';
  role: string = '';
  level: string = '';
  group: string = '';
  editedUser: any = {};
  editMode = false;
  loading = false; // Flag to indicate loading state
  private dataSubscription: Subscription | undefined;

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.loadUserData();

    this.dataSubscription = interval(2000).subscribe(() => {
      this.loadUserData();
    });
  }

  ngOnDestroy() {
    // Unsubscribe from the dataSubscription to avoid memory leaks
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }
  }

  loadUserData() {
    const userEmail = localStorage.getItem('email') || '';
    this.email = userEmail;
    this.loading = true; // Set loading to true when fetching data

    this.apiService.getUserByEmail(userEmail).subscribe(
      (userData: any) => {
        this.name = userData.name || '';
        this.lname = userData.lname || '';
        this.email = userData.email || '';
        this.role = userData.role || '';
        this.level = userData.level || '';
        this.group = userData.group || '';
        this.loading = false; // Set loading to false when data is loaded
      },
      (error: any) => {
        console.error('Error fetching user data:', error);
        this.loading = false; // Set loading to false on error
      }
    );
  }

  saveUser() {
    this.loading = true; // Set loading to true when saving data

    this.apiService.updateUserByEmail(this.email, { ...this.editedUser }).subscribe(
      () => {
        console.log('User updated successfully.');
        this.loadUserData();
        this.editMode = false;
        this.loading = false; // Set loading to false when data is saved
      },
      (error: any) => {
        console.error('Error updating user:', error);
        this.loading = false; // Set loading to false on error
      }
    );
  }

  cancelEditMode() {
    this.editMode = false;
    // Revert changes made during edit mode
    this.loadUserData();
  }
}
