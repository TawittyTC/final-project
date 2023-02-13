import { Component } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
@Component({
  selector: 'app-profile',
  template: `
    <ul *ngIf="auth.user$ | async as user">
      <li>{{ user.name }}</li>
      <li>{{ user.email }}</li>
    </ul>`
  //templateUrl: './profile.component.html',
  //styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {
  constructor(public auth: AuthService) {}

}
