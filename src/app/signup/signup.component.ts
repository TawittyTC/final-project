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

  constructor(private authService: AuthService) {}

  signUp() {
    console.log('Signing up with user data:', this.user); // Debugging statement

    this.authService.signUp(this.user).subscribe(
      (result) => {
        console.log('Registration API response:', result); // Debugging statement
        if (result) {
          console.log('Registration successful');
          // You can optionally redirect the user to a different page upon successful registration
          // Example: this.router.navigate(['/success-page']);
        };
      },
      (error) => {
        console.error('Error during registration:', error); // Debugging statement
        this.errorMessage = 'An error occurred while registering. Please try again later.';
      }
    );
  }
}
