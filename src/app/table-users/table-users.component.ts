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
    return this.apiService.getAllData().pipe(
      switchMap((response: any[]) => {
        this.devices = response.map((item) => item.device_id);
        return this.apiService.getAllUsers();
      })
    );
  }
  
  loadUsers() {
    this.loadDevices().subscribe((response: any[]) => {
      this.users = response.map(user => {
        user.accessArray = user.access ? user.access.split(',').map((device: string) => device.trim()) : [];
        return user;
      });
  
      if (this.editMode && this.editedUser.email) {
        this.editedUser = { ...this.users.find(user => user.email === this.editedUser.email) };
        this.editedUserForm.setValue({
          name: this.editedUser.name,
          email: this.editedUser.email,
          access: [...this.editedUser.accessArray],
          role: this.editedUser.role
        });
      }
    });
  }
  
  

  editUser(email: string) {
    this.editedUser = { ...this.users.find(user => user.email === email) };
    console.log('Edited User:', this.editedUser); // เพิ่มบรรทัดนี้
    this.editMode = true;
  
    // Initialize the editedUserForm with the selected user's data
    this.editedUserForm.setValue({
      name: this.editedUser.name,
      email: this.editedUser.email,
      access: [...this.editedUser.accessArray],
      role: this.editedUser.role
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

  
  removeAccess(index: number) {
    const accessArray = this.editedUserForm.get('access') as FormArray;
    accessArray.removeAt(index);
    this.editedUserForm.get('access')?.markAsDirty();
  }
  
  updateAccess(selectedDeviceId: string) {
    const accessArray = this.editedUserForm.get('access') as FormArray;
    
    // Check if the device is not already in the access array
    if (selectedDeviceId && !accessArray.value.includes(selectedDeviceId)) {
      accessArray.push(this.fb.control(selectedDeviceId));
      this.editedUserForm.get('access')?.markAsDirty();
    }
  }
  
  
  
  

}
