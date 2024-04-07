import { Component } from '@angular/core';
import { AuthService } from '../_service/auth.service';
import { User } from '../_service/user';
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent {
  user: User = new User(); // Initialize an empty user object
  errorMessage: string = ''; // To display error messages
  successMessage: string = ''; // To display success message

  constructor(private authService: AuthService) {}

  signUp() {
    console.log('Signing up with user data:', this.user); // Debugging statement

    this.authService.signUp(this.user).subscribe(
      (result) => {
        console.log('Registration API response:', result); // Debugging statement
        if (result) {
          console.log('Registration successful');
          this.successMessage = 'ลงทะเบียนสำเร็จ สามารถเข้าสู่ระบบได้แล้ว.';
        };
      },
      (error) => {
        console.error('Error during registration:', error); // Debugging statement
        this.errorMessage = 'ลงทะเบียนไม่สำเร็จ โปรดลองอีกครั้ง.';
      }
    );
  }
}
