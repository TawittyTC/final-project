import { Component ,Inject } from '@angular/core';

// Import the AuthService type from the SDK
import { AuthService } from '@auth0/auth0-angular';
import { DOCUMENT } from '@angular/common';
@Component({
  selector: 'app-auth-button',
  templateUrl: './auth-button.component.html',
  styleUrls: ['./auth-button.component.scss']
})
export class AuthButtonComponent {
  // Inject the authentication service into your component through the constructor
  constructor(public auth: AuthService) {}

}
