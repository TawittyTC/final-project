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
  AlertMessage: string = ''; // To display error messages
  SuccessMessage: string= '';


  constructor(private authService: AuthService) {}

  signUp() {
    console.log('Signing up with user data:', this.user); // Debugging statement

    this.authService.signUp(this.user).subscribe(
      (result) => {
        console.log('Registration API response:', result); // Debugging statement
        this. SuccessMessage = 'ลงทะเบียนสำเร็จ.';
        if (result) {
          console.log('Registration successful');
        };
      },
      (error) => {
        console.error('Error during registration:', error); // Debugging statement
        this.AlertMessage = 'ลงทะเบียนไม่สำเร็จ.';
      }
    );
  }
}
