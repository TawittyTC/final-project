// table-users.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { interval, Subscription } from 'rxjs';
import { ApiService } from 'src/app/api.service';
import { switchMap } from 'rxjs/operators';

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
  roles: string[] = [];
  // Define a FormGroup for the new user form
  newUserForm: FormGroup;
  // Define a FormGroup for the edited user form
  editedUserForm: FormGroup;
  private dataSubscription: Subscription | undefined;

  constructor(
    private apiService: ApiService,
    private fb: FormBuilder
  ) {
    // Initialize the new user form
    this.newUserForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      access: this.fb.array([]) // Use FormArray for access
    });
    
    // Initialize the edited user form
    this.editedUserForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      access: this.fb.array([]), // Use FormArray for access
      role: ['']
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

  loadDevices() {
    this.apiService.getAllData().subscribe((response: any) => {
      this.devices = response.map((item: { device_id: any }) => item.device_id.toString());
      //console.log(this.devices)
    });
  }
  
  loadUsers() {
    this.apiService.getAllUsers().subscribe(
      (response: any) => {
        this.users = response.map((user: any) => ({
          id: user.id,
          name: user.name,
          email: user.email,
          access: user.access,
          role: user.role,
          accessArray: user.access.split(',').map((item: string) => item.trim())
        }));
      },
      (error) => {
        console.error('Error loading users:', error);
        // Handle error as needed
      }
    );
  }
  
  
  

  editUser(email: string) {
    this.editedUser = { ...this.users.find(user => user.email === email) };
    console.log('Edited User:', this.editedUser);
    this.editMode = true;
  
    // Initialize the editedUserForm with the selected user's data
    this.editedUserForm.setValue({
      name: this.editedUser.name,
      email: this.editedUser.email,
      access: [...this.editedUser.accessArray],
      role: this.editedUser.role
    });
  
    // Set the 'access' FormControl in the form separately
    const accessArray = this.editedUserForm.get('access') as FormArray;
    accessArray.clear();
    this.editedUser.accessArray.forEach((device: string) => {
      accessArray.push(this.fb.control(device));
    });
  }
  
  
  
  saveUser() {
    if (this.editedUserForm.valid) {
      const formData = this.editedUserForm.value;
  
      // Update editedUser properties including the role
      this.editedUser.name = formData.name;
      this.editedUser.email = formData.email;
      this.editedUser.access = formData.access.join(','); // เปลี่ยนตรงนี้
      this.editedUser.role = formData.role;
  
      // Call the API to save changes
      this.apiService.updateUserByEmail(this.editedUser.email, this.editedUser).subscribe(() => {
        // Refresh data after saving
        this.loadUsers();
        this.cancelEditMode();
      });
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
          // Handle error as needed
        }
      );
    }
  }

  cancelEditMode() {
    this.editMode = false;
    this.editedUser = {};
  }
  // Remove this method
  updateRole(selectedRole: string) {
    this.editedUserForm.patchValue({
      role: selectedRole
    });
  }

  
  updateAccess(selectedDeviceId: string) {
    const accessArray = this.editedUserForm.get('access') as FormArray;
  
    // Check if the device is not already in the access array
    if (selectedDeviceId && !accessArray.value.includes(selectedDeviceId)) {
      accessArray.push(this.fb.control(selectedDeviceId));
      this.editedUserForm.get('access')?.markAsDirty();
    }
  }
  
  removeAccess(index: number) {
    const accessArray = this.editedUserForm.get('access') as FormArray;
    accessArray.removeAt(index);
    this.editedUserForm.get('access')?.markAsDirty();
  }
}
