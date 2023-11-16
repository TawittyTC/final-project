import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from './_service/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'final-project';
  constructor(private modalService: NgbModal, private authService: AuthService) {}

  public open(modal: any): void {
    this.modalService.open(modal);
  }

  ngOnInit() {
    this.authService.tokenExpiration$.subscribe(() => {
      // Display a notification to the user that the token is about to expire
      alert('Your session is about to expire. Please log in again.');

      // Perform a hard refresh to reload the page
      location.reload();
    });
  }
}
