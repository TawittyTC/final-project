// table-users.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { interval, Subscription } from 'rxjs';
import { ApiService } from 'src/app/api.service';
import { HttpClient } from '@angular/common/http';
import { GetImageService } from './../get-img.service';

@Component({
  selector: 'app-table-users',
  templateUrl: './table-users.component.html',
  styleUrls: ['./table-users.component.scss']
})
export class TableUsersComponent implements OnInit, OnDestroy {
  users: any[] = [];
  newUser: any = {};
  devices: any[] = [];
  editedUser: any = {};
  editMode = false;

  // Define a FormGroup for the new user form
  newUserForm: FormGroup;
  // Define a FormGroup for the edited user form
  editedUserForm: FormGroup;
  private dataSubscription: Subscription | undefined;

  constructor(
    private apiService: ApiService,
    private http: HttpClient,
    private GetImageService: GetImageService,
    private fb: FormBuilder
  ) {
    // Initialize the new user form
    this.newUserForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      access: [[]] // Access is an array of devices
    });

    this.editedUserForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      access: [[]]
    });
    

  }

  ngOnInit(): void {
    this.loadUsers();
    this.loadDevices();
    this.dataSubscription = interval(2000).subscribe(() => {
      this.loadUsers();
      this.loadDevices();
    });
  }

  ngOnDestroy() {
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }
  }

  loadUsers() {
    this.apiService.getAllUsers().subscribe((response: any) => {
      this.users = response;
      //console.log(this.users)
    });
  }

  loadDevices() {
    this.apiService.getAllData().subscribe((response: any) => {
      this.devices = response.map((item: { device_id: any }) => item.device_id.toString());
    });
  }

  addUser() {
    if (this.newUserForm.valid) {
      // If access is an array, convert it to a comma-separated string
      if (this.newUser.access && Array.isArray(this.newUser.access)) {
        this.newUser.access = this.newUser.access.join(',');
      }
  
      this.apiService.createUser(this.newUser).subscribe(() => {
        this.loadUsers();
        this.newUser = {};
      });
    }
  }
  

  editUser(email: string) {
    this.editedUser = { ...this.users.find(user => user.email === email) };
    this.editMode = true;
  
    // Set initial values for the form controls
    this.editedUserForm.setValue({
      name: this.editedUser.name,
      email: this.editedUser.email,
      access: this.editedUser.access.split(',')
    });
  }
  
  
  saveUser() {
    if (this.editedUserForm.valid) {
      const formData = this.editedUserForm.value;
  
      // Update editedUser properties
      this.editedUser.name = formData.name;
      this.editedUser.email = formData.email;
      this.editedUser.access = formData.access.join(',');
  
      // Call the API to save changes
      this.apiService.updateUserByEmail(this.editedUser.email, this.editedUser).subscribe(() => {
        this.loadUsers();
        this.cancelEditMode();
      });
    }
  }
  
  
  

  deleteUser(email: string) {
    // Implement user deletion logic here
  }

  cancelEditMode() {
    this.editMode = false;
    this.editedUser = {};
  }

  addDeviceToAccess() {
    const selectedDevice = this.newUserForm.get('access')?.value;
  
    if (selectedDevice && !this.newUser.access.includes(selectedDevice)) {
      // Add the selected device to the access array in the form
      this.newUser.access.push(selectedDevice);
  
      // Clear the selected device in the form control
      this.newUserForm.get('access')?.setValue([]);
    }
  }
  
  
  addDeviceToEditedAccess() {
    const selectedDevice = this.editedUserForm.get('access')?.value;
  
    if (selectedDevice && !this.editedUser.access.includes(selectedDevice)) {
      // Add the selected device to the access array in the form
      this.editedUserForm.get('access')?.setValue([...this.editedUserForm.get('access')?.value, selectedDevice]);
  
      // Clear the selected device in the form control
      this.editedUserForm.get('access')?.markAsDirty();
    }
  }
  
  
  
  
  
  
}
